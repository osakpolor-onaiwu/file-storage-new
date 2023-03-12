import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { validateSchema } from '../../utils/validatespec';
import { jsonS } from '../../utils/responses';
import { logout } from '../../services/user/logout';

const logout_schema = Joi.object({
    user_id: Joi.string().trim().required(),
    refresh_token: Joi.string().trim().required(),
    access_token_id: Joi.string().trim().required(),
  });

export default async function userLogout(req:Request, res:Response, next:NextFunction) {
    try {
        const data = validateSchema(logout_schema, req.body);
        const { user_id, refresh_token, access_token_id } = data;
        const response = await logout({ user_id, refresh_token, access_token_id});
        jsonS(res, response?.message || "Logout successful", response?.data);
    } catch (e) {
        next(e);
    }
}