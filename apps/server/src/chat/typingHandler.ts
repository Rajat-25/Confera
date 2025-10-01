import { WS_CONST } from '@repo/lib';
import { WebSocket } from 'ws';
import { TypingHandlerPropsType } from '../types';

export const typingHandler = ({
  ws,
  ClientMapping,
  payload,
}: TypingHandlerPropsType) => {
  const { TYPING, ERROR } = WS_CONST;
  const { phone } = payload;
  if (!phone) {
    return ws.send(
      JSON.stringify({
        type: ERROR,
        payload: { message: 'Invalid Payload' },
      })
    );
  }
  const receiverClient = ClientMapping.get(phone);
  if (receiverClient && receiverClient?.readyState === WebSocket.OPEN) {
    return receiverClient.send(
      JSON.stringify({
        type: TYPING,
        payload: {
          isTyping: true,
        },
      })
    );
  }
};
