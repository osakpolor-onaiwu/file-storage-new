import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { validateSchema } from '../../utils/validatespec';
import { jsonS } from '../../utils/responses';
import { generateNewToken } from '../../services/user/refresh-token';

const new_token_schema = Joi.object({
    refresh_token: Joi.string().trim().required(),
    user_id: Joi.string().trim().required(),
    ip_address: Joi.string().trim().ip().required(),
    user_agent: Joi.string().trim().required(),
});

export async function refreshUserToken(req:Request, res:Response, next:NextFunction) {
    try {
        const data = validateSchema(new_token_schema, req.body);
        const response = await generateNewToken({
            user_id: data.user_id,
            r_token: data.refresh_token,
            login_info: {
                ip_address: data['ip_address'],
                user_agent: data['user_agent'],
          }});
        jsonS(res, response?.message || "Token refreshed successful", response?.data);
    } catch (e) {
        next(e);
    }
}