import { NextFunction, Request, Response } from 'express';
import { jsonS, jsonErr } from '../../utils/responses';
import { authenticateUser } from '../../services/user/authenticate';

export default async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await authenticateUser(req.body);
    jsonS(res, response?.message || "Login successful", response?.data);
  } catch (e: any) {
    jsonErr(res, e.message, null)
  }
}