import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { signWsToken } from '@repo/lib';

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: 'unauthorized' },
      { status: 401 }
    );
  }

  const data = {
    userId: session.user.id,
    expiresIn: '5m' as const,
  };

  const { token, jti } = signWsToken(data);

  const responseData = { token, jti, expiresIn: 300 };

  return NextResponse.json({ success: true, responseData });
}
