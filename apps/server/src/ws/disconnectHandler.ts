import { WS_CONST } from '@repo/lib';
import { DisconnectHandlerPropsType } from '@repo/types';
import { GetContacts } from '../utils/helper';

export const disconnectHandler = async ({
  ws,
  broadcastStatusToContacts,
  sendMsgToClient,
}: DisconnectHandlerPropsType) => {
  const userContext = ws.userContext;
  if (!userContext) return;

  const { userId, phone } = userContext;

  const { ERROR } = WS_CONST;

  const { data: contacts, success } = await GetContacts(userId);

  if (!success) {
    sendMsgToClient({
      client: ws,
      type: ERROR,
      payload: {
        message: 'Internal server errror',
      },
    });
  }
  if (contacts?.length) {
    broadcastStatusToContacts({ contacts, status: 'offline', phone });
  }
  ws.close();
};
