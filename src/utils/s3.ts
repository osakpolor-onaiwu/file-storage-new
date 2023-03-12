import { validateSchema } from '../utils/validatespec';
// import AWS from 'aws-sdk';
import {S3Client, PutObjectCommand} from '@aws-sdk/client-s3'
import joi from 'joi';
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_REGION;
const s3BASE = process.env.AWS_S3BASE;
import Logger from '../utils/Logger'

const spec = joi.object({
  data: joi.any().required(),
  filename: joi.string(),
  content_type:joi.string().optional()
})

interface Resp{
  message: string,data: any
}
interface Payload{
  Bucket: string,
  Key: string,
  Body: any,
  ContentType?: string
}

export default async function s3(data: object,flag?:string):Promise<Resp> {

  try {
    const params = validateSchema(spec,data);
    if(flag && flag === 'json') params.data = JSON.stringify(params.data);
   
    let s3 = new S3Client({
      credentials:{
        accessKeyId:accessKeyId as string,
        secretAccessKey:secretAccessKey as string,
      },
      region:region
    });

    params.filename = params.filename || Date.now() + '_0_0_';
    let payload:Payload = {
      Bucket: bucketName as string,
      Key: params.filename,
      Body: params.data
    };
    if(params.content_type) payload.ContentType = params.content_type;

    const upload = new PutObjectCommand(payload);
   
    const success = await s3.send(upload)
    if(!success) throw new Error('Error uploading to s3')
    
    return {
      message:'success',
      data:'uploaded'
    };
  } catch (error:any) {

    Logger.error([error, error.stack, new Date().toJSON()], 's3_error');
    return {
      message:'error',
      data:error.message
    };
  }
}
