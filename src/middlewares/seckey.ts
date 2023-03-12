import { NextFunction, Request, Response } from 'express';
import { find } from "../dal/operation";
import { find as findUser } from "../dal/user"
import customError from "../utils/customerror";
import MerchantKeyModel from '../models/merchantkeys';
import { jsonErr } from '../utils/responses';

export async function seckey(req: any, res: Response, next: NextFunction) {
 
    try {
        const secret_key = req.headers.secret_key || req.body.secret_key || req.query.secret_key;
        if (!secret_key) throw new Error('secret_key is required');
        const get_key = await find({ secret_key }, MerchantKeyModel, 'one');
        if (!get_key) throw new Error('invalid secret_key passed')
    
        const user = await findUser({ _id: get_key.account_id });
        if (!user) throw new Error('User not found');

        req.account = {}
        req.account.user_id = user._id;
        req.account.user_name = user.username;
        req.account.email = user.email;
        req.account.role = user.role;
        req.account.is_verified = user.is_verified;
        req.account.blacklisted = user.blacklisted;
        return next();
    } catch (error: any) {
        jsonErr(res, error.message, null);
        throw customError(error.message);
    }
}