import { dbClient } from '@repo/db';

export const GetContacts = async (userId: string) => {
  try {
    const contacts = await dbClient.contact.findMany({
      where: {
        id: userId,
      },
      select: {
        phone: true,
      },
    });

    return { success: true, data: contacts };
  } catch (err) {
    return { success: false, data: null };
  }
};

export const GetUser = async (userId: string) => {
  try {
    const user = await dbClient.user.findFirst({
      where: { id: userId },
      select: { phone: true, name: true },
    });

    return { success: true, data: user };
  } catch (err) {
    return { success: false, data: null };
  }
};
