import { CHAT_CONST } from '@repo/lib';
import { ChatHandlerPropsType } from '../types';
import {
  createChat,
  createConversation,
  GetUser,
  updateConversation,
} from '../utils/helper';

export const chatHandler = async ({
  ws,
  payload,
  clientMapping,
  sendMsgToClient,
}: ChatHandlerPropsType) => {
  const createdAt = new Date();
  const { NEW_CONVERSATION, CHAT, CHAT_ERROR, UPDATE_CONVERSATION } =
    CHAT_CONST;

  const { receiverPhone, text, conversationId } = payload;
  const { userId: senderId, phone: senderPhone } = ws?.userContext!;

  if (!senderId || !senderPhone) {
    ws.send(
      JSON.stringify({
        type: CHAT_ERROR,
        payload: { message: 'Unauthorized' },
      })
    );
    return;
  }

  const receiverClient = clientMapping.get(receiverPhone);

  try {
    const { success: receiverUserSuccess, data: receiverUserData } =
      await GetUser({ phone: receiverPhone });

    if (!receiverUserSuccess || !receiverUserData) {
      ws.send(
        JSON.stringify({
          type: CHAT_ERROR,
          payload: { message: 'Invalid User' },
        })
      );
      return;
    }

    if (conversationId) {
      const [
        { success: chatSuccess, chat },
        { success: conversationSuccess, conversation },
      ] = await Promise.all([
        createChat({
          senderId,
          conversationId,
          text,
          createdAt,
        }),
        updateConversation({
          id: conversationId,
          lastMessage: text,
          lastMessageAt: createdAt,
          lastMessageById: senderId,
        }),
      ]);

      const chatPayload = {
        type: CHAT,
        payload: chat,
      };

      const getConversationPayload = (phone: string) => {
        return {
          type: UPDATE_CONVERSATION,
          payload: {
            phone: phone,
            conversation,
          },
        };
      };

      //Notify Sender
      ws.send(JSON.stringify(getConversationPayload(receiverPhone)));
      ws.send(JSON.stringify(chatPayload));

      //Notify Receiver
      if (receiverClient) {
        sendMsgToClient(receiverClient, chatPayload);
        sendMsgToClient(receiverClient, getConversationPayload(senderPhone));
      }
      return;
    }
    const { success: conversationSuccess, conversation } =
      await createConversation({
        lastMessage: text,
        lastMessageAt: createdAt,
        lastMessageById: senderId,
        userId: senderId,
        receiverUserId: receiverUserData.id,
      });

    const { success: chatSuccess, chat } = await createChat({
      senderId,
      conversationId: conversation?.id,
      text,
      createdAt,
    });

    const getConversationPayload = (phone: string) => {
      return {
        type: NEW_CONVERSATION,
        payload: {
          phone: phone,
          conversation,
        },
      };
    };

    const chatPayload = {
      type: CHAT,
      payload: chat,
    };

    //Notify Sender
    ws.send(JSON.stringify(getConversationPayload(receiverPhone)));
    ws.send(JSON.stringify(chatPayload));

    //Notify Receiver
    if (receiverClient) {
      sendMsgToClient(receiverClient, getConversationPayload(senderPhone));
      sendMsgToClient(receiverClient, chatPayload);
    }
    return;
  } catch (err) {
    return ws.send(
      JSON.stringify({
        type: CHAT_ERROR,
        payload: { message: 'Internal server error' },
      })
    );
  }
};
