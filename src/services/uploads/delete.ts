import { validateSchema } from '../../utils/validatespec';
import throwcustomError from '../../utils/customerror'
import joi from 'joi';
import DownloadModel, { Download } from '../../models/download';
import { remove as deleteDownload, find as findDownload } from '../../dal/operation';
import s3Delete from '../../utils/s3.delete';
import Logger from '../../utils/Logger';
import { service_return } from '../../interface/service_response'

const spec = joi.object({
    account_id: joi.string().trim().required(),
    id: joi.string().required()
})

export async function deletes(data: any) {

    try {
        const params = validateSchema(spec, data);

        const item = await findDownload({
            _id: params.id,
            accountid: params.account_id
        },
            DownloadModel,
            'one'
        )
        if (!item) throw new Error('Item not found or already deleted.');
        const is_deleted = await deleteDownload({ _id: params.id, accountid: params.account_id }, DownloadModel)
        if (is_deleted) await s3Delete({ filename: item.key });

        const res: service_return = {
            data: null,
            message: 'delete successful'
        }
        return res;

    } catch (error: any) {
        if (error.message.includes('Cast')) error.message = 'Please pass a valid id.';
        Logger.error([error, error.stack, new Date().toJSON()], 'FETCH-UPLOADS-ERRROR');
        throwcustomError(error.message);
    }
}