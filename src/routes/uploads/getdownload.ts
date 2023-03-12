import { getdownload } from '../../services/uploads/getdownload'; //path to service file
import { jsonS, jsonErr } from '../../utils/responses';
import { NextFunction, Request, Response } from 'express';

export default async function (req:any, res: Response, next: NextFunction) {
    if(req?.account?.user_id) req.query.account_id = String(req?.account?.user_id);
    if(!req.params) throw new Error('please provide a filename')
   
    try {
        if(!req.params) throw new Error('please provide a filename')
        req.query.filename = req.params.filename
        const searchs: any = await getdownload(req.query);
        jsonS(res, searchs?.message, searchs?.data);

    } catch (e: any) {
        jsonErr(res, e.message, null)
    }
}