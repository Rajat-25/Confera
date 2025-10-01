'use server';

import {
  contactSchema,
  DeleteContactSchema,
  DeleteContactSchemaType,
  EditContactSchema,
  EditContactSchemaType,
} from '@/utils';
import { dbClient } from '@repo/db';
import {
  GetAllMappedContactsResponseType,
  GetUserContactsResponse,
  MappedContactType,
} from '@repo/types';
import { revalidatePath } from 'next/cache';
import { isUserAuthorized } from '../shared';

export const GetAllMappedContacts =
  async (): Promise<GetAllMappedContactsResponseType> => {
    try {
      const { success, data } = await isUserAuthorized();

      if (!success || !data?.userId) {
        return { success: false, message: 'User not authorized', data: null };
      }
      const { userId } = data;

      const { success: contactSuccess, data: contactData } =
        await GetUserContacts();
      if (!contactSuccess || !contactData) {
        return {
          success: false,
          message: 'Error fetching contacts',
          data: null,
        };
      }

      const mappedContacts: MappedContactType = {};

      contactData?.forEach((contact) => {
        const data = {
          phone: contact.phone,
          fullName: contact.fullName,
        };

        return Object.assign(mappedContacts, { [contact.phone]: data });
      });

      return {
        success: true,
        message: 'Mapped Contacts fetched successfully',
        data: mappedContacts,
      };
    } catch (err) {
      return { success: false, message: 'Error fetching data', data: null };
    }
  };

export const AddContact = async (formData: any) => {
  const { success, data } = await isUserAuthorized();

  if (!success || !data?.userId) {
    return { success: false, message: 'User not authorized' };
  }
  const { userId } = data;
  const result = contactSchema.safeParse(formData);

  if (!result.success) {
    return { success: false, errors: result.error.issues };
  }

  await dbClient.contact.create({
    data: {
      ...result.data,
      user: {
        connect: { id: userId },
      },
    },
  });

  revalidatePath('/contacts');
  return { success: true, message: 'Contact added successfully' };
};

export const EditContact = async (val: EditContactSchemaType) => {
  const { success, data } = await isUserAuthorized();

  if (!success || !data?.userId) {
    return { success: false, message: 'User not authorized' };
  }
  const { userId } = data;

  const parsed = EditContactSchema.safeParse(val);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues };
  }

  await dbClient.contact.update({
    where: {
      id: parsed.data.id,
      userId,
    },
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
    },
  });

  revalidatePath('/contacts');
  return { success: true, message: 'Contact updated successfully' };
};

export const DeleteContact = async (val: DeleteContactSchemaType) => {
  const { success, data } = await isUserAuthorized();

  if (!success || !data?.userId) {
    return { success: false, message: 'User not authorized' };
  }
  const { userId } = data;

  const parsed = DeleteContactSchema.safeParse(val);
  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues };
  }

  const contact = await dbClient.contact.findFirst({
    where: { id: parsed.data.id, userId },
  });

  if (!contact) {
    return { success: false, message: 'Not found or unauthorized' };
  }

  await dbClient.contact.delete({ where: { id: contact.id } });

  revalidatePath('/contacts');

  return { success: true, message: 'Contact deleted successfully' };
};

export const GetUserContacts = async (): Promise<GetUserContactsResponse> => {
  const { success, data } = await isUserAuthorized();

  if (!success || !data?.userId) {
    return { success: false, message: 'User not authorized', data: null };
  }
  const { userId } = data;

  try {
    const contacts = await dbClient.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        fullName: true,
        phone: true,
        id: true,
        email: true,
      },
    });

    return {
      success: true,
      data: contacts,
      message: 'Contacts fetched successfully',
    };
  } catch (err) {
    return { success: false, message: 'Error fetching contacts', data: null };
  }
};
