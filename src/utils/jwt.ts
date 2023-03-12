import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

/**
 * JWT signing options
 */
export interface JWTOptions {
  /**
   * this flag determines whether or not we are generating a token for an app or a user
   */
  is_app: boolean;
  audience?: string | undefined;
  subject?: string | undefined;
  expiresIn?: string | number | undefined;
}

/**
 * Generates a JsonWebToken based on the payload and options supplied
 * @param payload: any
 * @param options: JWTOptions
 * @returns generateTokenRType
 */
export function generateToken(payload: any, options?: JWTOptions): generateTokenRType {
  const sign_options: SignOptions = {
    issuer: process.env.BASE_URL,
    algorithm: 'HS256',
    expiresIn:process.env.TOKEN_EXPIRY || '1d'//note expiresIn is in seconds if you want one day it is 24*60*60,
  };
  
  sign_options.jwtid = uuidv4();

  //the jwt sign takes the payload a token secret which should be a string, make it very long and random, and an option
  const token = jwt.sign(payload, process.env.TOKEN_SECRET, sign_options);

  return {
    token,
    token_id: sign_options.jwtid,
  };
}

/**
 * Verifies the signature and issuer of a given JsonWebToken
 * @param token
 * @returns string | JwtPayload
 */
// this verifies the token provided in the Authorization headers
const key={
  invalid:1,
  Invalid:1,
  malformed:1
}
export function verify(token: string) {
  return jwt.verify(token, process.env.TOKEN_SECRET, { algorithms: ['HS256'], issuer: process.env.BASE_URL },(err,decoded)=>{
    if(err){
      if(
        err.message.includes('Invalid') || 
        err.message.includes('malformed')||
        err.message.includes('invalid')
        ) err.message = "Invalid Token Passed";
      if(err.message.includes('expired')) err.message = "Token has expired"
      throw new Error(err.message)
    } 
    else return decoded
  });
}

/**
 * Describes the return type used by jwt.generateToken
 */
export type generateTokenRType = { token: string; token_id: string };
