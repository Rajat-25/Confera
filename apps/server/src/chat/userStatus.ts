import { WebSocket } from 'ws';
import { WS_CONST } from '@repo/lib';

type UserStatusType = {
  ClientMapping: Map<string, WebSocket>;
  payload: { phone: string };
  ws: WebSocket;
};

export const userStatus = async ({
  ClientMapping,
  payload,
  ws,
}: UserStatusType) => {
  const { USER_STATUS } = WS_CONST;
  const { phone } = payload;
  const receiverClient = ClientMapping.get(phone);

  ws.send(
    JSON.stringify({
      type: USER_STATUS,
      payload: {
        statusOf: phone,
        status: receiverClient ? 'online' : 'offline',
      },
    })
  );
};
