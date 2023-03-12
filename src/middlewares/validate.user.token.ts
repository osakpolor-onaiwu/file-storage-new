import { NextFunction, Request, Response } from 'express';
import { getUser } from '../services/user/misc';
import { UserAccessTokenPayload } from '../types/user';
import { verify as verifyJwt } from '../utils/jwt';
import { objectIsEmpty } from '../utils/misc';
import customError from "../utils/customerror";
import { jsonErr } from '../utils/responses';

export async function validateUserToken (req: any, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      throw customError('Missing authorization');
    }

    const token = req?.headers ? req.headers.authorization.split(' ') : [];

    // check that the value of the `Authorization` header contains both `Bearer` and `${value}`
    if (token.length !== 2)
      throw customError('invalid_request, please provide a valid token.');

    if (token[0] !== 'Bearer') throw customError('please prove Bearer as first word');

    const result = verifyJwt(token[1]);
    const decoded_token = result as unknown as UserAccessTokenPayload;
    const access_token_id = decoded_token['jti'];

    const user = await getUser(decoded_token.user_id);
    if (!user || objectIsEmpty(user)) throw customError('no user is associated with this token');

    req.account = {}
    req.account.user_id = user._id;
    req.account.user_name = user.username;
    req.account.email = user.email;
    req.account.role = user.role;
    req.account.is_verified = user.is_verified;
    req.account.blacklisted = user.blacklisted;

    next();

  } catch (error: any) {
    jsonErr(res, error.message, null);
  }
}