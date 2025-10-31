import { verifyWsToken, WS_CONST } from '@repo/lib';
import { authHandlerSchema, ChatAuthPropsType_S } from '@repo/types';
import { GetContacts, GetUser } from '../utils/helper';

export const authHandler = async ({
  ws,
  payload,
  clientMapping,
  sendMsgToClient,
  broadcastStatusToContacts,
}: ChatAuthPropsType_S) => {
  const { AUTH_SUCCESS, AUTH_FAILED, ERROR } = WS_CONST;
  try {
    const parsed = authHandlerSchema.safeParse(payload);

    if (!parsed.success) {
      sendMsgToClient({
        client: ws,
        type: ERROR,
        payload: {
          message: 'invalid payload',
        },
      });
      return;
    }

    const { jwtToken } = parsed.data;

    const { success: tokenSuccess, decoded } = verifyWsToken(jwtToken);

    if (!tokenSuccess || !decoded) {
      sendMsgToClient({
        client: ws,
        type: AUTH_FAILED,
        payload: { message: 'Invalid/Expired Token' },
      });
      ws.close();
      return;
    }

    const { sub: userId } = decoded;

    const [
      { data: userData, success: userSuccess },
      { data: contactData, success: contactSuccess },
    ] = await Promise.all([GetUser({ userId }), GetContacts(userId)]);

    if (!userSuccess || !userData || !contactSuccess) {
      sendMsgToClient({
        client: ws,
        type: ERROR,
        payload: {
          message: 'Internal server error',
        },
      });
      ws.close();
      return;
    }

    const { phone } = userData;

    ws.userContext = {
      userId,
      phone: phone!,
    };

    clientMapping.set(phone!, ws);

    sendMsgToClient({
      client: ws,
      type: AUTH_SUCCESS,
      payload: { message: 'WS Connection established successfully' },
    });

    if (contactData && contactData?.length) {
      broadcastStatusToContacts({
        contacts: contactData,
        phone: phone!,
        status: 'online',
      });
    }
    console.log(`User ${phone} Connected ✔ \n `);
  } catch (err) {
    console.error('Auth error ❌:', err);

    sendMsgToClient({
      client: ws,
      type: AUTH_FAILED,
      payload: { message: 'Internal server error' },
    });

    ws.close();
  }
};
