import { NextFunction, Request, Response } from 'express';
import { jsonS, jsonErr } from '../../utils/responses';
import { user_details} from '../../services/user/getuserdetail';

export default async function login(req: any, res: Response, next: NextFunction) {
  try {
    const response = await user_details(req.account);
    jsonS(res, response?.message || "User details fetched successfully", response?.data);
  } catch (e: any) {
    jsonErr(res, e.message, null)
  }
}