'use server';

import { z } from 'zod';
import { Chat, Conversation, dbClient, User } from '@repo/db';
import { isUserAuthorized } from '../shared';
import { phoneSchema } from '@/utils';
import {
  conversationType,
  ConversationWithParticipants,
  GetAllConversationsIdResponse,
  GetAllConversationsResponse,
  GetUserChatResponse,
} from '@repo/types';

const chatSchema = z.object({
  contactId: z.string('Invalid contact id'),
});

export const GetAllConversationsId =
  async (): Promise<GetAllConversationsIdResponse> => {
    const { success: authSuccess, userId } = await isUserAuthorized();

    if (!authSuccess || !userId) {
      return { success: false, message: 'User not authorized' };
    }

    try {
      const conversations = await dbClient.conversation.findMany({
        where: {
          participants: { some: { id: userId } },
        },
        select: {
          id: true,
          participants: {
            where: { id: { not: userId } },
            select: { phone: true },
          },
        },
      });

      const conversationMap: Record<string, string> = {};

      conversations.forEach((conv) => {
        const otherParticipant = conv.participants[0];
        if (otherParticipant && otherParticipant.phone) {
          conversationMap[otherParticipant.phone] = conv.id;
        }
      });

      return {
        success: true,
        message: 'Conversations fetched',
        data: conversationMap,
      };
    } catch (err) {
      return { success: false, message: 'Internal Server error' };
    }
  };

export async function GetUserChat(phone: string): Promise<GetUserChatResponse> {
  const { success, userId } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }

  const { success: schemSuccess, data } = phoneSchema.safeParse(phone);

  if (!schemSuccess) {
    return { success: false, message: 'Invalid phone number' };
  }

  const contact = await dbClient.user.findUnique({
    where: { phone: data },
  });

  if (!contact) {
    return { success: false, message: 'Contact not found' };
  }

  try {
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
    return { success: false, message: 'Internal Server error' };
  }
}

export async function GetAllConversations(): Promise<GetAllConversationsResponse> {
  const { success, userId, userPhone } = await isUserAuthorized();

  if (!success || !userId) {
    return { success: false, message: 'User not authorized' };
  }

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
    return { success: false, message: 'Internal Server error' };
  }
}
