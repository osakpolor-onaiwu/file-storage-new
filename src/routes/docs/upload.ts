import { docservice } from '../../services/docs/uploaddoc'; //path to service file
import { jsonS, jsonErr } from '../../utils/responses';
import { NextFunction, Request, Response } from 'express';

export default async function (req: any, res: Response, next: NextFunction) {
    try {
        if(req?.account?.user_id) req.body.account_id = String(req?.account?.user_id);
       
        const docservices: any = await docservice(req.body);
        jsonS(res, docservices?.message, docservices?.data);

    } catch (e: any) {
        jsonErr(res, e.message, null);
    }
}