'use server';

import { DeleteContactSchemaType, EditContactSchemaType } from '@/utils';
import { contactSchema, DeleteContactSchema, EditContactSchema } from '@/utils';
import { dbClient } from '@repo/db';
import { revalidatePath } from 'next/cache';
import { isUserAuthorized } from '../shared';



export async function AddContact(formData: any) {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }
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
}

export async function EditContact(data: EditContactSchemaType) {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }

  const parsed = EditContactSchema.safeParse(data);

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
}

export async function DeleteContact(data: DeleteContactSchemaType) {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }

  const parsed = DeleteContactSchema.safeParse(data);
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
}

export async function GetUserContacts() {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized', contacts: [] };
  }

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
      contacts,
      message: 'Contacts fetched successfully',
    };
  } catch (err) {
    return { success: false, message: 'Error fetching contacts', contacts: [] };
  }
}
