import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JwtVerifyType } from '@repo/types';

type SignWSTokenPropsType = {
  userId: string;
  expiresIn: SignOptions['expiresIn'];
};


const WS_JWT_SECRET = process.env.WS_JWT_SECRET || '';

export function signWsToken(data: SignWSTokenPropsType) {
  const { userId, expiresIn = '5m' } = data;
  const now = Math.floor(Date.now() / 1000);
  const jti = uuidv4();

  const payload = { sub: userId, jti, iat: now };

  const token = jwt.sign(payload, WS_JWT_SECRET, { expiresIn });

  return { token};
}

export const verifyWsToken = (
  token: string
): {
  success: boolean;
  decoded?: JwtVerifyType;
} => {
  try {
    const decoded = jwt.verify(token, WS_JWT_SECRET) as JwtVerifyType;
    return { success: true, decoded };
  } catch (err) {
    return { success: false };
  }
};
