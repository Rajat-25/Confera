import { verifyWsToken, WS_CONST } from '@repo/lib';
import { ChatAuthPropsType_S } from '../types';
import { GetContacts, GetUser } from '../utils/helper';

export const chatAuth = async ({
  ws,
  payload,
  ClientMapping,
  broadcastStatusToContacts,
}: ChatAuthPropsType_S) => {
  const { AUTH_SUCCESS, AUTH_FAILED, CHAT, ERROR } = WS_CONST;
  try {
    const { success: tokenSuccess, decoded } = verifyWsToken(payload.jwtToken);

    if (!tokenSuccess || !decoded) {
      ws.send(
        JSON.stringify({ type: AUTH_FAILED, message: 'Invalid/Expired Token' })
      );
      return ws.close();
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

    ClientMapping.set(phone!, ws);

    ws.send(
      JSON.stringify({
        type: AUTH_SUCCESS,
        message: 'WS Connection established successfully',
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
