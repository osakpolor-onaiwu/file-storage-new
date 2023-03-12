import { validateSchema } from '../../utils/validatespec';
import throwcustomError from '../../utils/customerror'
import joi from 'joi';
import DownloadModel, { Download } from '../../models/download';
import { find, countDocument } from '../../dal/operation';
import Logger from '../../utils/Logger';
import moment from 'moment';
import { normalizer } from '../../utils/normalizer';
import { service_return } from '../../interface/service_response';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer'
const cloudfront_url = process.env.CLOUTFRONT_URL

const spec = joi.object({
  from: joi.date().iso(),
  to: joi.date().iso(),
  name: joi.string().trim(),
  type: joi.string().trim().valid('document upload', 'document conversion', 'image upload', 'image conversion'),
  account_id: joi.string().trim().required(),
  page: joi.number(),
  limit: joi.number().default(10),
  id: joi.string()
})

export async function search(data: any) {
  try {
    const params = validateSchema(spec, data);
    const paramsclone = { ...params };
    const page = paramsclone.page || 1;
    delete paramsclone.page;
    const skip = (page - 1) * paramsclone.limit;

    const listConfig: any = {};
    if (paramsclone.from || paramsclone.to) {
      listConfig.createdAt = {};
      if (paramsclone.from) {
        listConfig.createdAt.$gte = new Date(paramsclone.from);
      }

      if (paramsclone.to) {
        listConfig.createdAt.$lte = new Date(paramsclone.to);
      }
    }

    if (paramsclone.account_id) listConfig.accountid = paramsclone.account_id;
    if (paramsclone.id) listConfig.id = paramsclone.id;
    if (paramsclone.type) listConfig.type = paramsclone.type;
    if (paramsclone.name) {
      listConfig.file = {};
      const regexp = new RegExp(paramsclone.name, 'i');
      listConfig.file.$regex = regexp;
    }

    const uploads: any = await find(listConfig, DownloadModel, 'all', '', {
      limit: paramsclone.limit,
      skip,
    });

    if (!uploads) throw new Error('You have no uploads');

    const count = await countDocument(listConfig, DownloadModel);

    const response = uploads.map((item: any) => {
      item.createdAt = moment(item.createdAt).format('Do MMMM YYYY hh:mm a');
      if (item.createdAt === 'Invalid Date') item.createdAt = 'n/a';
      const url = `${cloudfront_url}/${item.key}`
      /*here we sign the url ensure it expires in 1 day, so after one day someone can't use the same
      url except our app generates new one*/
      const outputurl = getSignedUrl({
          url,
          dateLessThan: String(new Date(Date.now() +1000*24*60*60)),
          privateKey:process.env.CLOUDFRONT_PRIVATE_KEY as string,
          keyPairId:process.env.CLOUDFRONT_KEYPAIR_ID as string
      })
      item.url = outputurl;
      return normalizer.uploads(item);
    });

    const res: service_return = {
      data: {
        page_info: {
          total_volume: count,
          current_page: page,
          page_size: paramsclone.limit,
          total_page: Math.ceil(count / paramsclone.limit),
        },
        response
      },
      message: 'results fetched'
    }
    return res;

  } catch (error: any) {
    if (error.message.includes('Cast')) error.message = 'Please pass a valid id.';
    Logger.error([error, error.stack, new Date().toJSON()], 'FETCH-UPLOADS-ERROR');
    throwcustomError(error.message);
  }
}