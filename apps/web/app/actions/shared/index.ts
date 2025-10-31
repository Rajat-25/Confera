import { auth } from '@/auth';
import { IsUserAuthorizedResponse } from '@repo/types';

export const isUserAuthorized = async (): Promise<IsUserAuthorizedResponse> => {
  console.log('inside isUserAuthorized func ....');

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, message: 'User not authorized' };
    }

    return {
      success: true,
      message: 'User authorized',
      data: {
        userId: session.user.id,
        userPhone: session.user.phone,
      },
    };
  } catch (err) {
    console.log('Error in isUserAuthenticated ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};
