import { verifyWsToken, WS_CONST } from '@repo/lib';
import { ChatAuthPropsType_S } from '../types';
import { GetContacts, GetUser } from '../utils/helper';

export const authHandler = async ({
  ws,
  payload,
  clientMapping,
  broadcastStatusToContacts,
}: ChatAuthPropsType_S) => {
  const { AUTH_SUCCESS, AUTH_FAILED, ERROR } = WS_CONST;
  try {
    const { jwtToken } = payload;
    const { success: tokenSuccess, decoded } = verifyWsToken(jwtToken);
    console.log('---- \n', decoded, '---- \n', tokenSuccess);

    if (!tokenSuccess || !decoded) {
      ws.send(
        JSON.stringify({
          type: AUTH_FAILED,
          payload: { message: 'Invalid/Expired Token' },
        })
      );
      ws.close();
      return;
    }

    const { sub: userId } = decoded;

    const [
      { data: userData, success: userSuccess },
      { data: contactData, success: contactSuccess },
    ] = await Promise.all([GetUser({ userId }), GetContacts(userId)]);

    if (!userSuccess || !userData || !contactSuccess) {
      ws.send(
        JSON.stringify({
          type: ERROR,
          payload: {
            message: 'Internal server error',
          },
        })
      );
      return ws.close();
    }

    const { phone } = userData;

    ws.userContext = {
      userId,
      phone: phone!,
    };

    clientMapping.set(phone!, ws);

    ws.send(
      JSON.stringify({
        type: AUTH_SUCCESS,
        payload: { message: 'WS Connection established successfully' },
      })
    );

    if (contactData && contactData?.length) {
      broadcastStatusToContacts({
        contacts: contactData,
        phone: phone!,
        status: 'online',
      });
    }
    console.log(`\nUser ${phone} Connected ✔ \n `);
  } catch (err) {
    console.error('Auth error ❌:', err);

    ws.send(
      JSON.stringify({
        type: AUTH_FAILED,
        payload: { message: 'Internal server error' },
      })
    );
    ws.close();
  }
};
