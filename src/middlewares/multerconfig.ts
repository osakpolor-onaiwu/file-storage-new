import multer from 'multer';

const setup = multer({ dest: "temp/", limits: { 
    fieldSize: 8 * 1024 * 1024 ,
    fileSize: 2.4 * 1024 * 1024
} }).single(
    "file"
)

export default setup;