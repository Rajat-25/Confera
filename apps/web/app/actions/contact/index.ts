'use server';

import {
  contactSchema,
  DeleteContactSchema,
  DeleteContactSchemaType,
  EditContactSchema,
  EditContactSchemaType,
} from '@repo/types';
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
    console.log('inside getAllMappedContacts func ....');

    const { success } = await isUserAuthorized();

    if (!success) {
      return { success: false, message: 'User not authorized', data: null };
    }

    try {
      const { success: contactSuccess, data: contactData } =
        await GetUserContacts();

      if (!contactSuccess) {
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

        Object.assign(mappedContacts, { [contact.phone]: data });
      });

      return {
        success: true,
        message: 'Successfully fetched mappedContacts',
        data: mappedContacts,
      };
    } catch (err) {
      console.log('Error in getAllMappedContacts ....', err);

      return {
        success: false,
        message: 'Error While fetching data',
        data: null,
      };
    }
  };

export const AddContact = async (formData: any) => {
  console.log('inside addContact func ....');

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }

  const { userId } = data;
  const parsed = contactSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues };
  }

  try {
    await dbClient.contact.create({
      data: {
        ...parsed.data,
        user: {
          connect: { id: userId },
        },
      },
    });

    revalidatePath('/contacts');
    return { success: true, message: 'Contact added successfully' };
  } catch (err) {
    console.log('Error in addContact ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const EditContact = async (val: EditContactSchemaType) => {
  console.log('inside editContact func ....');

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }
  const { userId } = data;

  const parsed = EditContactSchema.safeParse(val);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues };
  }

  try {
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
  } catch (err) {
    console.log('Error in editContact ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const DeleteContact = async (val: DeleteContactSchemaType) => {
  console.log('inside deleteContact func ....');

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }
  const { userId } = data;

  const parsed = DeleteContactSchema.safeParse(val);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.issues };
  }

  try {
    const contact = await dbClient.contact.findFirst({
      where: { id: parsed.data.id, userId },
      select: {
        id: true,
      },
    });

    if (!contact) {
      return { success: false, message: 'Contact Not found' };
    }

    await dbClient.contact.delete({ where: { id: contact.id } });

    revalidatePath('/contacts');

    return { success: true, message: 'Contact deleted successfully' };
  } catch (err) {
    console.log('Error in deleteContact ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const GetUserContacts = async (): Promise<GetUserContactsResponse> => {
  console.log('inside getUserContacts func ....');

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
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
    console.log('Error in getUserContacts ....', err);

    return {
      success: false,
      message: 'Something went wrong',
      data: null,
    };
  }
};
