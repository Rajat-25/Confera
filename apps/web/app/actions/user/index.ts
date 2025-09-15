'use server';

import { phoneSchema } from '@/utils';
import { dbClient } from '@repo/db';
import { isUserAuthorized } from '../shared';

export async function getUserPhoneNo() {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }

  try {
    const user = await dbClient.user.findUnique({ where: { id: userId } });
    return {
      success: true,
      phone: user?.phone ?? null,
      message: ' Phone number fetched successfully',
    };
  } catch (err) {
    return { success: false, message: 'Internal Server error' };
  }
}

export async function AddUserPhoneNo(prevState: any, formData: FormData) {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }

  const result = phoneSchema.safeParse(formData.get('phone'));

  if (!result.success) {
    return { success: false, message: 'Invalid phone number' };
  }

  try {
    const user = await dbClient.user.update({
      where: { id: userId },
      data: { phone: result.data },
    });

    return { success: true, message: 'Phone added successfully' };
  } catch (err) {
    return { success: false, message: 'Phone already exists or DB error' };
  }
}
