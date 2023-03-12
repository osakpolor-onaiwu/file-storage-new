import { ObjectId } from 'mongodb';
import { LoginAttempt } from '../models/login-attempt';

export type UserAccessTokenPayload = { 
  user_id: ObjectId; 
  email: string; 
  phone?: string; 
  jti: string, 
  username?: string,
  role?:string,
  is_verified?:boolean;
  blacklisted?:boolean
};

export type LoginInfo = Pick<LoginAttempt, 'ip_address' | 'user_agent'>;
