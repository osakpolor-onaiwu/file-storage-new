import { validateSchema } from '../utils/validatespec';
import AWS from 'aws-sdk';
import joi from 'joi';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const spec = joi.object({
  filename: joi.string().required(),
})

export default async function s3(data: object) {
  try {
    const params = validateSchema(spec,data);
    AWS.config.update({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    let s3 = new AWS.S3();
    let payload = {
      Bucket: 'filestorage-utility',
      Key: params.filename,
    };

    const upload = s3.deleteObject(payload).promise();
    const link = upload
      .then((data) => {
    
        //delete from db here
        return 'deleted';
      })
      .catch((err: object) => {
        throw err;
      });

    return link;
  } catch (error) {
    throw error;
  }
}
