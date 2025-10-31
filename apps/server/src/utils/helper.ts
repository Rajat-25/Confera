import { dbClient } from '@repo/db';
import {
  ConversationType,
  CreateChatPayloadPropsType,
  CreateChatSchema,
  CreateConversationSchema,
  CreateConversationType,
  GetContactsResponseType,
  GetUserParamsSchema,
  GetUserParamsType,
  GetUserResponseType,
  phoneSchema,
  UpdateConversationSchema,
  UserIdSchema,
  UserIdType,
} from '@repo/types';

export const GetContacts = async (
  userId: UserIdType
): Promise<GetContactsResponseType> => {
  console.log('inside GetContacts func ....');

  const parsed = UserIdSchema.safeParse(userId);

  if (!parsed.success) {
    return { success: false, message: 'invalid payload' };
  }

  try {
    const contacts = await dbClient.contact.findMany({
      where: {
        userId: parsed.data,
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
    console.log('Error in getContacts func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const GetUser = async (
  props: GetUserParamsType
): Promise<GetUserResponseType> => {
  console.log('inside GetUser func ....');

  const parsed = GetUserParamsSchema.safeParse(props);

  if (!parsed.success) {
    return { success: false, message: 'invalid payload' };
  }

  try {
    const { userId, phone } = parsed.data;
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
    console.log('Error in getUser func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const createChat = async (props: CreateChatPayloadPropsType) => {
  console.log('inside createChat func ....');

  const parsed = CreateChatSchema.safeParse(props);

  if (!parsed.success) {
    return { success: false, message: 'invalid payload' };
  }

  try {
    const chat = await dbClient.chat.create({
      data: {
        ...parsed.data,
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
    console.log('Error in createChat func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const createConversation = async (props: CreateConversationType) => {
  console.log('inside createConversation func ....');

  const parsed = CreateConversationSchema.safeParse(props);

  if (!parsed.success) {
    return { success: false, message: 'invalid payload' };
  }

  const {
    lastMessageAt,
    lastMessageById,
    receiverUserId,
    userId,
    lastMessage,
  } = parsed.data;

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
    console.log('Error in createConversation func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const updateConversation = async (props: ConversationType) => {
  console.log('inside updateConversation func ....');

  const parsed = UpdateConversationSchema.safeParse(props);

  if (!parsed.success) {
    return { success: false, message: 'invalid_payload' };
  }

  const { lastMessage, lastMessageAt, lastMessageById, id } = parsed.data;
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
    console.log('Error in updateConversation func ....', err);

    return { success: false, message: 'Something went wrong' };
  }
};

export const isUserValid = async (phoneNo: string) => {
  console.log('inside isUserValid func ....');

  const parsed = phoneSchema.safeParse(phoneNo);

  if (!parsed.success) {
    return { success: false, message: 'invalid_payload' };
  }

  try {
    const user = await dbClient.user.findFirst({
      where: {
        phone: parsed.data,
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
    console.log('Error in isUserValid func ....', err);

    return {
      success: false,
      message: 'something_went_wrong',
    };
  }
};
