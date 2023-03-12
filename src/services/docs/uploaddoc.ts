import { validateSchema } from '../../utils/validatespec';
import throwcustomError from '../../utils/customerror'
import joi from 'joi';
import axios from "axios";
import url from 'url';
import DownloadModel from '../../models/download';
import { save as saveDownload } from '../../dal/operation';
import Logger from '../../utils/Logger';
import { service_return } from '../../interface/service_response';
import QueueModel, { Queue } from '../../models/queue';
import { saveQueueItem } from '../../worker/dal';

const spec = joi.object({
    url: joi.string().uri(),
    raw_data: joi.string(),
    type: joi.any().valid('json', 'csv', 'html', 'pdf').required(),
    name: joi.string().trim().required().error(new Error('Please provide a name')),
    file_description: joi.string().trim().optional(),
    account_id: joi.string().trim().required(),
    conversion_options: joi.any().valid('json-csv', 'csv-json', 'html-pdf')
})

const parse_json =(json_data:any)=>{
    let parsed_data;
    try {
        parsed_data = JSON.parse(String(json_data));
        return parsed_data;
    } catch (error) {
        throw new Error('please pass a valid json');
    }
}

export async function docservice(data: any) {

    let file_extension = null, file_name: string = '';
    let data_to_convert;
    let parsed_data = null;
    let flag;

    try {
        const params = validateSchema(spec, data);
        params.name = params.name.replace(" ", "_");
        if ((params.url && params.raw_data) || (!params.url && !params.raw_data)) throw new Error('Please provide either url or raw data, but not both at the same.');

        if (params.conversion_options) {
            const convert = params.conversion_options.split('-');
            params.from = convert[0];
            params.to = convert[1];
        }
       
        if (params.url) {
            const get_file: any = await axios.get(params.url);
            if (!get_file || !get_file.data) throw new Error('The file in the url could not be found');
            if (params.from && params.from == 'html') {
                if(params.type !== 'html') throw new Error('html can only be converted to pdf')
                flag = 'html'
                data_to_convert = get_file.data;
                file_name = `${params.name}.${params.to}` || `file-${Date.now()}.${params.to}`
            }
            else {
                params.raw_data = get_file.data;
            }
        }

        if (params.raw_data) {
            if (params.from === 'csv' && params.to === 'json') {
                flag = 'json';
                data_to_convert = params.raw_data;
                file_name = `${params.name}.${params.to}` || `file-${Date.now()}.${params.to}`
            } else if (params.from === 'json' && params.to === 'csv') {
                //ensure file is json
                try {
                    parsed_data = JSON.parse(String(params.raw_data));
                } catch (error) {
                    throw new Error('please pass a valid json');
                }

                data_to_convert = parsed_data;
                file_name = `${params.name}.${params.to}` || `file-${Date.now()}.${params.to}`
            } else {
                //upload data directly to s3
                if(params.type === 'json'){
                    parse_json(params.raw_data)
                }
                data_to_convert = params.raw_data;
                file_name = `${params.name}.${params.type}` || `file-${Date.now()}.${params.type}`;
            }
        }

        const response = await saveDownload({
            file: params.name,
            key: file_name,
            url: 'N/A',
            accountid: params.account_id,
            type: 'document'
        },
            DownloadModel)


        saveQueueItem({
            data: { file_extension, from: params.from, to: params.to, data_to_convert, filename: file_name, download_id: response._id },
            run_on: new Date(),
            status: 'new',
            job: 'doc'

        }, QueueModel)

        let msg='upload in progress';
        if(params.from) msg= "conversion in progress";

        const res: service_return = {
            message: msg,
            data: response
        }

        return res;

    } catch (error: any) {
        Logger.error([error, error.stack, new Date().toJSON()], 'DOC-UPLOAD-ERROR');
        if (error.message.includes('duplicate')) error.message = 'you already have a file with this name'
        throwcustomError(error.message);
    }
}