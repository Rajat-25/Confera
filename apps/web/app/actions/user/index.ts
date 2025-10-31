'use server';

import { IsUserExistSchema, IsUserExistType, phoneSchema } from '@repo/types';
import { dbClient } from '@repo/db';
import { GeneralResponseType } from '@repo/types';
import { isUserAuthorized } from '../shared';

export const getUserPhoneNo = async () => {
  console.log('inside getUserPhoneNo func ....');

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }
  const userId = data.userId;

  try {
    const user = await dbClient.user.findUnique({ where: { id: userId } });
    return {
      success: true,
      phone: user?.phone ?? null,
      message: ' Phone number fetched successfully',
    };
  } catch (err) {
    console.log('Error in getUserPhoneNo func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const isUserExist = async (
  props: IsUserExistType
): Promise<GeneralResponseType> => {
  console.log('inside isUserExist func ....');

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }

  const parsed = IsUserExistSchema.safeParse(props);

  if (!parsed.success) {
    return { success: false, message: 'Phone or Email required' };
  }
  const { email, phone } = parsed.data;

  try {
    const user = await dbClient.user.findFirst({
      where: {
        OR: [{ phone }, { email }],
      },
      select: { id: true,email:true },
    });

    return user?.id
      ? {
          success: true,
          message: 'User Exist',
        }
      : { success: false, message: 'User does not exist' };
  } catch (err) {
    console.log('Error in isUserExist func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const AddUserPhoneNo = async (prevState: any, formData: FormData) => {
  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }

  const userId = data.userId;
  const parsed = phoneSchema.safeParse(formData.get('phone'));

  if (!parsed.success) {
    return { success: false, message: 'Invalid phone number' };
  }

  try {
    await dbClient.user.update({
      where: { id: userId },
      data: { phone: parsed.data },
    });

    return { success: true, message: 'Phone added successfully' };
  } catch (err) {
    console.log('Error while adding phoneNo ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};
