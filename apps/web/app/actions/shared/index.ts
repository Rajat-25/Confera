import { auth } from '@/auth';

export async function isUserAuthorized() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, userId: null, userPhone: null };
  }

  return {
    success: true,
    userId: session.user.id,
    userPhone: session.user.phone,
  };
}
