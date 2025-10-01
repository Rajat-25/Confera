import { WS_CONST } from '@repo/lib';
import { WebSocket } from 'ws';

type UserStatusType = {
  ClientMapping: Map<string, WebSocket>;
  ws: WebSocket;
  payload: { phone: string };
};

export const userStatus = async ({
  ClientMapping,
  payload,
  ws,
}: UserStatusType) => {
  const { USER_STATUS } = WS_CONST;
  const { phone } = payload;
  const receiverClient = ClientMapping.get(phone);

  return ws.send(
    JSON.stringify({
      type: USER_STATUS,
      payload: {
        statusOf: phone,
        status: receiverClient && receiverClient.readyState === WebSocket.OPEN ? 'online' : 'offline',
      },
    })
  );
};
