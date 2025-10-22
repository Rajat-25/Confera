import { CHAT_CONST } from '@repo/lib';
import { WebSocket } from 'ws';
import { UserStatusType } from '../types';

export const userStatus = async ({
  ws,
  payload,
  clientMapping,
}: UserStatusType) => {
  const { USER_STATUS } = CHAT_CONST;
  const { phone } = payload;
  const receiverClient = clientMapping.get(phone);

  ws.send(
    JSON.stringify({
      type: USER_STATUS,
      payload: {
        statusOf: phone,
        status:
          receiverClient && receiverClient.readyState === WebSocket.OPEN
            ? 'online'
            : 'offline',
      },
    })
  );

  return;
};
