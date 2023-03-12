import { ObjectId } from 'mongodb';


export interface Options{
    rowDelimiter?: string,
    pdfFormat?:any,
    includeHeaders?:boolean,
    fullPage?:boolean,
    quality?:number
}
export interface S3upload {
    file: string;
    filename: string;
    download_id: ObjectId;
    from?: string;
    to?: string;
    data_to_convert?:any;
    options?: Options;
}