import { CHAT_CONST } from '@repo/lib';
import { WebSocket } from 'ws';
import { TypingHandlerPropsType } from '../types';

export const typingHandler = ({
  ws,
  clientMapping,
  payload,
}: TypingHandlerPropsType) => {
  const { TYPING, CHAT_ERROR } = CHAT_CONST;
  const { phone } = payload;
  if (!phone) {
    ws.send(
      JSON.stringify({
        type: CHAT_ERROR,
        payload: { message: 'Invalid Payload' },
      })
    );
    return;
  }
  const receiverClient = clientMapping.get(phone);
  if (receiverClient && receiverClient?.readyState === WebSocket.OPEN) {
    receiverClient.send(
      JSON.stringify({
        type: TYPING,
        payload: {
          isTyping: true,
        },
      })
    );

    return;
  }
};
