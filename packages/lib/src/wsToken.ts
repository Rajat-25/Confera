import { JwtVerifyType } from '@repo/types';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

type SignWSTokenPropsType = {
  userId: string;
  expiresIn: SignOptions['expiresIn'];
};

const secret = process.env.WS_JWT_SECRET || '';

export function signWsToken(data: SignWSTokenPropsType) {
  console.log('inside signWsToken func ....');

  const { userId, expiresIn = '15m' } = data;
  const now = Math.floor(Date.now() / 1000);
  const jti = uuidv4();

  const payload = { sub: userId, jti, iat: now };

  const token = jwt.sign(payload, secret, { expiresIn });

  return { token };
}

export const verifyWsToken = (
  token: string
): {
  success: boolean;
  decoded?: JwtVerifyType | null;
} => {
  console.log('inside verifyWsToken func ....');

  try {
    const decoded = jwt.verify(token, secret) as JwtVerifyType;

    return { success: true, decoded };
  } catch (err) {
    console.error('Error in  verifyWsToken ....', err);

    return { success: false, decoded: null };
  }
};
