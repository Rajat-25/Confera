import { CHAT_CONST } from '@repo/lib';
import { ChatServicePropsType } from '@repo/types';
import { chatHandler } from './chatHandler';
import { typingHandler } from './typingHandler';
import { userStatusHandler } from './userStatusHandler';

export const chatService = async ({
  ws,
  type,
  payload,
  clientMapping,
  sendMsgToClient,
}: ChatServicePropsType) => {
  const { CHAT, TYPING, USER_STATUS } = CHAT_CONST;
  if (type === CHAT) {
    await chatHandler({
      ws,
      payload,
      clientMapping,
      sendMsgToClient,
    });
  } else if (type == USER_STATUS) {
    userStatusHandler({
      ws,
      payload,
      clientMapping,
      sendMsgToClient,
    });
  } else if (type === TYPING) {
    typingHandler({ ws, clientMapping, payload, sendMsgToClient });
  }
};
