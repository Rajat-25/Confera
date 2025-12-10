'use server';

import { dbClient } from '@repo/db';
import {
  GetAllConversationsIdResponse,
  GetAllConversationsResponse,
  GetUserChatResponse,
  MappedConversationType,
  phoneSchema,
} from '@repo/types';
import { isUserAuthorized } from '../shared';
import {
  activeServerActions,
  serverActionCounter,
  serverActionDuration,
  serverActionErrorCounter,
} from '@/monitoring/metrics';

export const GetAllMappedConversation =
  async (): Promise<GetAllConversationsIdResponse> => {
    console.log('inside getAllMappedConversation func ....');

    const labels = { action: 'GetAllMappedConversation' };
    const end = serverActionDuration.startTimer(labels);
    serverActionCounter.inc(labels);
    activeServerActions.inc(labels);

    const { success: authSuccess, data } = await isUserAuthorized();

    if (!authSuccess || !data?.userId) {
      return { success: false, message: 'User not authorized', data: null };
    }

    const { userId } = data;

    try {
      const conversations = await dbClient.conversation.findMany({
        where: {
          participants: { some: { id: userId } },
        },
        select: {
          id: true,
          lastMessage: true,
          lastMessageAt: true,
          lastMessageById: true,
          participants: {
            where: { id: { not: userId } },
            select: { phone: true },
          },
        },
      });

      const dbMappedConversation: MappedConversationType = {};

      conversations.forEach((conv) => {
        const otherParticipant = conv.participants[0];

        if (otherParticipant && otherParticipant.phone) {
          dbMappedConversation[otherParticipant.phone] = {
            id: conv.id,
            lastMessage: conv.lastMessage,
            lastMessageAt: conv.lastMessageAt,
            lastMessageById: conv.lastMessageById,
          };
        }
      });

      return {
        success: true,
        message: 'Conversations fetched',
        data: dbMappedConversation,
      };
    } catch (err) {
      console.error('Error in getAllMappedConversation ....', err);
      serverActionErrorCounter.inc(labels);
      return { success: false, message: 'Something went wrong', data: null };
    } finally {
      activeServerActions.dec(labels);
      end();
    }
  };

export const GetUserChat = async (
  phone: string
): Promise<GetUserChatResponse> => {
  console.log('inside getUserChat func ....');

  const labels = { action: 'GetUserChat' };
  const end = serverActionDuration.startTimer(labels);
  serverActionCounter.inc(labels);
  activeServerActions.inc(labels);

  const { success, data } = await isUserAuthorized();

  if (!success || !data) {
    return { success: false, message: 'User not authorized' };
  }

  const { userId } = data;

  const parsed = phoneSchema.safeParse(phone);

  if (!parsed.success) {
    return { success: false, message: 'Invalid phone number' };
  }

  try {
    const contact = await dbClient.user.findUnique({
      where: { phone: parsed.data },
    });

    if (!contact) {
      return { success: false, message: 'Contact not found' };
    }

    const chats = await dbClient.chat.findMany({
      where: {
        conversation: {
          participants: {
            every: { id: { in: [userId, contact.id] } },
          },
          AND: [
            { participants: { some: { id: userId } } },
            { participants: { some: { id: contact.id } } },
          ],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        id: true,
        text: true,
        senderId: true,
        conversationId: true,
        createdAt: true,
      },
    });

    return { success: true, chats, message: 'Chats fetched successfully' };
  } catch (err) {
    console.error('Error in getUserChat ....', err);
    serverActionErrorCounter.inc(labels);
    return { success: false, message: 'Something went wrong' };
  } finally {
    activeServerActions.dec(labels);
    end();
  }
};

export const GetAllConversations =
  async (): Promise<GetAllConversationsResponse> => {
    console.log('inside getAllConversations func ....');
    const labels = { action: 'GetAllConversations' };
    const end = serverActionDuration.startTimer(labels);
    serverActionCounter.inc(labels);
    activeServerActions.inc(labels);

    const { success, data } = await isUserAuthorized();

    if (!success || !data) {
      return { success: false, message: 'User not authorized' };
    }
    const { userId } = data;

    try {
      const conversations = await dbClient.conversation.findMany({
        where: {
          participants: {
            some: { id: userId },
          },
        },
        select: {
          id: true,
          lastMessage: true,
          lastMessageById: true,
          lastMessageAt: true,
          participants: {
            where: { id: { not: userId } },
            select: { name: true, phone: true, email: true },
          },
        },
      });

      return {
        success: true,
        data: conversations,
        message: 'Chats fetched successfully',
      };
    } catch (err) {
      console.error('Error in getAllConversations ....', err);
      serverActionErrorCounter.inc(labels);
      return { success: false, message: 'Something went wrong' };
    } finally {
      activeServerActions.dec(labels);
      end();
    }
  };
