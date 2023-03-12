import s3 from '../utils/s3';
import Logger from '../utils/Logger'
import DownloadModel from '../models/download';
import QueueModel, { Queue } from '../models/queue';
import { find as findDownload, update as updateDownload } from '../dal/operation';
import { findQueueItem, updateQueueItem } from './dal';
import { S3upload } from './interface';
import { initiateMongodb } from '../config/mongo';
import {convert} from '../utils/convert'

(async () => {
    // if (cancelworker()) return;
    await initiateMongodb()

    try {
        const queue_item = await findQueueItem({
            status: 'new',
            run_on: { $lte: Date.now() },
            job: 'doc',
        },
            QueueModel,
            'all',
            undefined,
            { limit: 5 }
        )

        if (!queue_item.length) throw new Error('no queue item found');
        //for each item upload them
        for (const item of queue_item) {
            let flag;
            let converted;
            await updateQueueItem({ _id: item._id }, { status: 'pending' }, QueueModel);
            let params: S3upload;
            params = item.data;
    
            const download_exist = await findDownload({ _id: params.download_id }, DownloadModel, 'one');
            if (!download_exist) throw new Error('download item not found');
            
            const convert_data = await convert(params)
            if(!convert_data) throw new Error('could not convert data');
            converted = convert_data.converted;
            flag = convert_data.flag;
    
            const upload = await s3({ data: converted, filename: params.filename }, flag);
    
            if (upload.message === 'success') {
                await updateDownload({ _id: params?.download_id, }, { url: upload.data }, DownloadModel);
                await updateQueueItem({ _id: item._id }, { status: 'completed', complete_message: 'upload completed successfully' }, QueueModel);
                continue;
            } else {
                await updateDownload({ _id: params?.download_id, }, { url: null }, DownloadModel);
                await updateQueueItem({ _id: item._id }, { status: 'failed', complete_message: upload.data }, QueueModel);
                throw new Error(upload.data)
            }
        }

        // if (parentPort) parentPort.postMessage('done');
        process.exit(0);
    } catch (error: any) {
        if (error.message !== 'no queue item found') Logger.error([error, error.stack, new Date().toJSON()], 'error converting data');
        process.exit(0);
    }

})()

