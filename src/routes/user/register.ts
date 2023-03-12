import { NextFunction, Request, Response } from 'express';
import { registerUser } from '../../services/user/register';
import { jsonS, jsonErr } from '../../utils/responses';

export default async function register(req:Request, res:Response, next:NextFunction) {
    try {
        const response = await registerUser(req.body);
        jsonS(res, response?.message || "User registered", {});
    } catch (e: any) {
        jsonErr(res,e.message, null);
    }
}