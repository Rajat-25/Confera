import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

type SignWSTokenPropsType = {
  userId: string;
  expiresIn: SignOptions['expiresIn'];
};

type JWTverifyType = {
  sub: string;
  jti?: string;
  iat?: number;
  exp?: number;
};

const WS_JWT_SECRET = process.env.WS_JWT_SECRET || '';

export function signWsToken(data: SignWSTokenPropsType) {
  const { userId, expiresIn = '5m' } = data;
  const jti = uuidv4();
  const now = Math.floor(Date.now() / 1000);

  const payload = { sub: userId, jti, iat: now };
  const options: SignOptions = { expiresIn };

  const token = jwt.sign(payload, WS_JWT_SECRET, options);

  return { token, jti };
}

export const verifyWsToken=(token: string)=> {
  return jwt.verify(token, WS_JWT_SECRET) as JWTverifyType;
}
