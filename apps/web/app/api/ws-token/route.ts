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

  const { token } = signWsToken({
    userId: session.user.id,
    expiresIn: '10m' as const,
  });

  return NextResponse.json({ success: true, token });
}
