import { dbClient } from '@repo/db';
import { ContactsDbType } from '../types';
import { success } from 'zod';

type GeneralResponseType = {
  success: boolean;
  message: string;
};
type GetContactsResponseType = GeneralResponseType & {
  data?: ContactsDbType[];
};

type GetUserResponseType = GeneralResponseType & {
  data?: {
    id: string;
    phone: string | null;
    name: string;
  };
};

export const GetContacts = async (
  userId: string
): Promise<GetContactsResponseType> => {
  try {
    const contacts = await dbClient.contact.findMany({
      where: {
        userId,
      },
      select: {
        phone: true,
      },
    });

    return {
      success: true,
      message: 'Contacts fetched successfully',
      data: contacts,
    };
  } catch (err) {
    return { success: false, message: 'Internal server error' };
  }
};

type GetUserParamsType = {
  userId?: string;
  phone?: string;
};


export const GetUser = async (
  props: GetUserParamsType
): Promise<GetUserResponseType> => {
  try {
    const { userId, phone } = props;
    const user = await dbClient.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
      select: { phone: true, name: true, id: true },
    });

    return user
      ? { success: true, data: user, message: 'User fetched successfully' }
      : { success: false, message: 'Invalid user' };
  } catch (err) {
    return { success: false, message: 'Internal server error' };
  }
};

export const createChat = async ({
  senderId,
  conversationId,
  text,
  createdAt,
}: any) => {
  try {
    const chat = await dbClient.chat.create({
      data: {
        senderId,
        conversationId,
        text,
        createdAt,
      },
      select: {
        id: true,
        text: true,
        senderId: true,
        conversationId: true,
        createdAt: true,
      },
    });
    return { success: true, message: 'Chat created successfully', chat };
  } catch (err) {
    return { success: false, message: 'Internal server error' };
  }
};

export const createConversation = async ({
  lastMessage,
  lastMessageAt,
  lastMessageById,
  userId,
  receiverUserId,
}: any) => {
  try {
    const conversation = await dbClient.conversation.create({
      data: {
        lastMessage,
        lastMessageAt,
        lastMessageById,
        participants: {
          connect: [{ id: userId }, { id: receiverUserId }],
        },
      },
      select: {
        id: true,
        lastMessage: true,
        lastMessageAt: true,
        lastMessageById: true,
      },
    });

    return {
      success: true,
      message: 'Conversation created successfully',
      conversation,
    };
  } catch (err) {
    return { success: false, message: 'Internal server error' };
  }
};

export const updateConversation = async ({
  lastMessage,
  lastMessageAt,
  lastMessageById,
  id,
}: any) => {
  try {
    const conversation = await dbClient.conversation.update({
      where: { id },
      data: {
        lastMessage,
        lastMessageAt,
        lastMessageById,
      },
    });

    return {
      success: true,
      message: 'Conversation updated successfully',
      conversation,
    };
  } catch (err) {
    return { success: false, message: 'Internal server error' };
  }
};
