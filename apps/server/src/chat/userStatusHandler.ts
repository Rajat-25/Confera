import { CHAT_CONST } from '@repo/lib';
import { PhoneSchema, UserStatusType } from '@repo/types';
import { WebSocket } from 'ws';

export const userStatusHandler = async ({
  ws,
  payload,
  clientMapping,
  sendMsgToClient,
}: UserStatusType) => {
  const { USER_STATUS, CHAT_ERROR } = CHAT_CONST;
  const parsed = PhoneSchema.safeParse(payload);

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

  const { phone } = parsed.data;

  const receiverClient = clientMapping.get(phone);

  sendMsgToClient({
    client: ws,
    type: USER_STATUS,
    payload: {
      statusOf: phone,
      status:
        receiverClient && receiverClient.readyState === WebSocket.OPEN
          ? 'online'
          : 'offline',
    },
  });
};
