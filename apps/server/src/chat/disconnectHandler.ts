import { WS_CONST } from '@repo/lib';
import { GetContacts } from '../utils/helper';

export const DisconnectHandler = async ({
  ws,
  broadcastStatusToContacts,
  userId,
}: any) => {
  const { ERROR } = WS_CONST;
  const { data: contactData } = await GetContacts(userId);
  if (!contactData) {
    ws.send(
      JSON.stringify({
        type: ERROR,
        payload: {
          message: 'Internal server errror',
        },
      })
    );

    return;
  }

  broadcastStatusToContacts(contactData);
};
