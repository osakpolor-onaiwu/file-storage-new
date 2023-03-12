import { NextFunction, Request, Response } from 'express';

export async function extractClientInfo(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.ip_address = req.ip || "";
      req.body.user_agent = req.useragent?.source || ""
      return next();
    } catch (error) {
      next(error);
    }
  }