import { validateSchema } from '../../utils/validatespec';
import throwcustomError from '../../utils/customerror'
import joi from 'joi';
import DownloadModel from '../../models/download';
import { find as findDownload } from '../../dal/operation';
import Logger from '../../utils/Logger';
import { service_return } from '../../interface/service_response';
import * as AWS from 'aws-sdk';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
import axios from "axios";
import { convert } from '../../utils/convert';

AWS.config.update({
    region,
    accessKeyId,
    secretAccessKey
})
const s3 = new AWS.S3()
const spec = joi.object({
    account_id: joi.string().trim().required(),
    filename: joi.string().required(),
    expiry: joi.number().default(120),
    options: joi.any().valid('json-csv', 'csv-json', 'html-pdf')
})

export async function getdownload(data: any) {
    try {
        const params = validateSchema(spec, data);
        const item = await findDownload({
            file: params.filename,
            accountid: params.account_id
        },
            DownloadModel,
            'one'
        )

        if (!item) throw new Error('Download not found');

        let is_succesful = 'Pending';
        if (item.url === null) is_succesful = 'Failed';
        else if (item.url === 'uploaded') is_succesful = 'Successful'

        let res_data: any = 'N/A';
        if (is_succesful === 'Successful') {
            res_data = await s3.getSignedUrlPromise('getObject', {
                Bucket: bucketName,
                Key: item.key,
                Expires: params.expiry
            })

            if (params.options) {
                const convert_option = params.options.split('-');
                params.from = convert_option[0];
                params.to = convert_option[1];

                const get_data =  await axios.get(res_data);
                if(!get_data) throw new Error('could not fetch data from s3')

                params.data_to_convert = get_data.data;
                const converted_data = await convert(params);
                if (converted_data) res_data = converted_data?.converted;
            }
        } else if (is_succesful == 'Failed') res_data = null;

        const res: service_return = {
            message: `Download ${is_succesful}`,
            data: res_data,
        }
        return res
    } catch (error: any) {
        if (error.message.includes('Cast')) error.message = 'Please pass a valid id.';
        Logger.error([error, error.stack, new Date().toJSON()], 'FETCH-DOWNLOAD-ERROR');
        throwcustomError(error.message);
    }
}