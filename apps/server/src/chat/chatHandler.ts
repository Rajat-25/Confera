import { CHAT_CONST } from '@repo/lib';
import { ChatHandlerPropsType, SendMsgSchema } from '@repo/types';
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

  const parsed = SendMsgSchema.safeParse(payload);

  if (!parsed.success) {
    sendMsgToClient({
      client: ws,
      type: CHAT_ERROR,
      payload: {
        message: 'invalid payload...',
      },
    });

    return;
  }
  const { receiverPhone, text, conversationId } = parsed.data;

  const { userId: senderId, phone: senderPhone } = ws?.userContext!;

  if (!senderId || !senderPhone) {
    sendMsgToClient({
      client: ws,
      type: CHAT_ERROR,
      payload: { message: 'Unauthorized' },
    });

    return;
  }

  const receiverClient = clientMapping.get(receiverPhone);

  try {
    const { success: receiverUserSuccess, data: receiverUserData } =
      await GetUser({ phone: receiverPhone });

    if (!receiverUserSuccess || !receiverUserData) {
      sendMsgToClient({
        client: ws,
        type: CHAT_ERROR,
        payload: { message: 'Invalid User' },
      });

      return;
    }

    const UpdateCoversationArg = {
      id: conversationId!,
      lastMessage: text,
      lastMessageAt: createdAt,
      lastMessageById: senderId,
    };

    const ChatArg = {
      senderId,
      conversationId: conversationId!,
      text,
      createdAt,
    };

    if (conversationId) {
      const [
        { success: chatSuccess, chat },
        { success: conversationSuccess, conversation },
      ] = await Promise.all([
        createChat(ChatArg),
        updateConversation(UpdateCoversationArg),
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

      sendMsgToClient({ client: ws, ...getConversationPayload(receiverPhone) });
      sendMsgToClient({ client: ws, ...chatPayload });

      //Notify Receiver
      if (receiverClient) {
        sendMsgToClient({ client: receiverClient, ...chatPayload });
        sendMsgToClient({
          client: receiverClient,
          ...getConversationPayload(senderPhone),
        });
      }
      return;
    }

    const CreateConversationArg = {
      lastMessage: text,
      lastMessageAt: createdAt,
      lastMessageById: senderId,
      userId: senderId,
      receiverUserId: receiverUserData.id,
    };
    const { success: conversationSuccess, conversation } =
      await createConversation(CreateConversationArg);

    const Chat_Arg = {
      senderId,
      conversationId: conversation?.id!,
      text,
      createdAt,
    };

    const { success: chatSuccess, chat } = await createChat(Chat_Arg);

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
    sendMsgToClient({ client: ws, ...getConversationPayload(receiverPhone) });
    sendMsgToClient({ client: ws, ...chatPayload });

    //Notify Receiver
    if (receiverClient) {
      sendMsgToClient({
        client: receiverClient,
        ...getConversationPayload(senderPhone),
      });
      sendMsgToClient({ client: receiverClient, ...chatPayload });
    }
    return;
  } catch (err) {
    console.log('Error in chatHandler', err);

    sendMsgToClient({
      client: ws,
      type: CHAT_ERROR,
      payload: { message: 'Internal server error' },
    });
  }
};
