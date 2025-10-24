import { CHAT_CONST } from '@repo/lib';
import { ChatServicePropsType } from '../types';
import { chatHandler } from './chatHandler';
import { typingHandler } from './typingHandler';
import { userStatus } from './userStatus';

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
    await userStatus({
      clientMapping,
      payload,
      ws,
    });
  } else if (type === TYPING) {
    typingHandler({ ws, clientMapping, payload });
  }
};
