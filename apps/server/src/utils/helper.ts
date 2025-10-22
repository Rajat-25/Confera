import { dbClient } from '@repo/db';
import {
  GetContactsResponseType,
  GetUserParamsType,
  GetUserResponseType,
} from '../types';

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

export const isUserValid = async (phoneNo: string) => {
  try {
    const user = await dbClient.user.findFirst({
      where: {
        phone: phoneNo,
      },
      select: {
        id: true,
      },
    });

    if (user && user.id) {
      return { success: true, message: 'success' };
    } else {
      return { success: false, message: 'invalid_user' };
    }
  } catch (err) {
    return {
      success: false,
      message: 'something_went_wrong',
    };
  }
};
