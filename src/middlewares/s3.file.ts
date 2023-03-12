import AWS from 'aws-sdk';
import handlevalidation from '../utils/handlevalidation';
const accessKeyId = process.env.AWS_ACCESS_KEY_TEMP;
const secretAccessKey = process.env.AWS_SECRET_KEY_TEMP;
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { jsonErr } from '../utils/responses';



let s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
});


const upload = multer({
  limits:{
    fieldSize:2 * 1024 * 1024,
    fileSize: 2 * 1024 * 1024
  },
  storage: multerS3({
    s3: s3,
    bucket: 'filestorage-utility',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req?: any, file?: any, cb?: any) {
      cb(null, { fieldName: file.fieldname });
    },

    key: function (req?: any, file?: any, cb?: any) {
      if (file) req.body.file = file;
      req.body.paths = req.originalUrl
      const validate = handlevalidation(req.body);
      if (validate.err) {
        cb(new Error(validate.err));
      }
      cb(null, `${req.body.name + '_' + Date.now()  + '_' + String(req?.query?.user_id)}${path.extname(file?.originalname.toLowerCase())}`.split(' ').join(''));
    }
  })
})

const uploadfile = upload.single('file');

export default function fileupload(req: any, res: any, next: any) {

  uploadfile(req, res, function (err) {
    if (err) {
      if (`${err?.message}`?.includes('Inaccessible host')) err.message = 'error uploading file to host'
      jsonErr(res, err.message, null);
    } else {
      next()
    }
  })
}

