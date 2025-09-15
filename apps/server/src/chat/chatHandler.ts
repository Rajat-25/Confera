import { dbClient } from '@repo/db';
import { WS_CONST } from '@repo/lib';
import {
  NewConversationPayload,
  SendMsgPayloadType,
  UserContextType,
} from '@repo/types';
import WebSocket from 'ws';

type ChatHandlerPropsType = {
  ws: WebSocket;
  payload: SendMsgPayloadType;
  userContext: UserContextType;
  ClientMapping: Map<string, WebSocket>;
  sendMsgToClient: (ws: WebSocket, data: any) => void;
};

export const chatHandler = async ({
  ws,
  payload,
  userContext,
  ClientMapping,
  sendMsgToClient,
}: ChatHandlerPropsType) => {
  const { receiverPhone, text, conversationId } = payload;
  const createdAt = new Date();

  const { NEW_CONVERSATION, CHAT } = WS_CONST;

  const receiverClient = ClientMapping.get(receiverPhone);

  const receiver = await dbClient.user.findFirst({
    where: {
      phone: receiverPhone,
    },
    select: {
      id: true,
    },
  });

  let chat = null;

  if (receiver && conversationId) {
    try {
      await dbClient.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: text,
          lastMessageById: userContext.userId,
          lastMessageAt: createdAt,
        },
      });

      chat = await dbClient.chat.create({
        data: {
          senderId: userContext.userId,
          conversationId: conversationId,
          text: text,
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

      const payload = {
        type: CHAT,
        payload: chat,
      };

      ws.send(JSON.stringify(payload));

      if (receiverClient) {
        sendMsgToClient(receiverClient, payload);
      }
    } catch (err) {}
  } else if (receiver && !conversationId) {
    try {
      const userPhone = await dbClient.user.findFirst({
        where: {
          id: userContext.userId,
        },
        select: {
          phone: true,
        },
      });

      const { id } = await dbClient.conversation.create({
        data: {
          lastMessage: text,
          lastMessageAt: createdAt,
          lastMessageById: userContext.userId,
          participants: {
            connect: [{ id: userContext.userId }, { id: receiver.id }],
          },
        },
        select: {
          id: true,
        },
      });

      chat = await dbClient.chat.create({
        data: {
          senderId: userContext.userId,
          conversationId: id,
          text: text,
          createdAt: createdAt,
        },
        select: {
          id: true,
          text: true,
          senderId: true,
          conversationId: true,
          createdAt: true,
        },
      });

      const newConvPayload = {
        type: NEW_CONVERSATION,
        payload: {
          phone: userPhone?.phone,
          conversationId: id,
        },
      };

      const chatPayload = {
        type: CHAT,
        payload: chat,
      };

      ws.send(
        JSON.stringify({
          type: NEW_CONVERSATION,
          payload: {
            phone: receiverPhone,
            conversationId: id,
          },
        })
      );

      ws.send(JSON.stringify(chatPayload));

      if (receiverClient) {
        sendMsgToClient(receiverClient, newConvPayload);
        sendMsgToClient(receiverClient, chatPayload);
      }
    } catch (err) {}
  }
};
