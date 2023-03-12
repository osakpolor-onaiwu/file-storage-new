import { deletes } from '../../services/uploads/delete'; //path to service file
import { jsonS, jsonErr } from '../../utils/responses';
import { NextFunction, Request, Response } from 'express';

export default async function (req: Request, res: Response, next: NextFunction) {
    if(req?.query?.user_id) req.body.account_id = String(req?.query?.user_id);
    try {
        const deleted: any = await deletes(req.body);
        jsonS(res, deleted?.message, deleted?.data);

    } catch (e: any) {
        jsonErr(res, e.message, null)
    }
}