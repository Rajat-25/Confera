import { Contact, dbClient } from '@repo/db';
import { verifyWsToken, WS_CONST } from '@repo/lib';
import WebSocket from 'ws';
import { GetContacts, GetUser } from '../utils/helper';

type ContactsDbType = {
  phone: string;
};

type ChatAuthPropsType_S = {
  ws: WebSocket;
  payload: any;
  ClientMapping: Map<string, WebSocket>;
  broadcastStatusToContacts: (
    contacts: ContactsDbType[],
    phone: string
  ) => void;
};

export const chatAuth = async ({
  ws,
  payload,
  ClientMapping,
  broadcastStatusToContacts,
}: ChatAuthPropsType_S) => {
  const { AUTH_SUCCESS, AUTH_FAILED, CHAT, ERROR } = WS_CONST;
  try {
    const { sub, jti, iat, exp } = verifyWsToken(payload.jwtToken);

    const { data: userData } = await GetUser(sub);
    const { data: contactData } = await GetContacts(sub);

    if (!userData || !contactData) {
      ws.send(
        JSON.stringify({
          type: ERROR,
          payload: {
            message: 'Internal server errro',
          },
        })
      );
      return;
    }

    const { phone, name } = userData;

    if (sub && phone) {
      ws.userContext = {
        userId: sub,
      };
      ClientMapping.set(phone, ws);
    }

    ws.send(
      JSON.stringify({
        type: AUTH_SUCCESS,
        message: 'WS Connection established successfully',
      })
    );

    if (contactData.length && phone) {
      broadcastStatusToContacts(contactData, phone);
    }
    console.log(`\n User ${name} Connected ✔ \n `);
  } catch (err) {
    console.error('Auth error ❌:', err);

    ws.send(JSON.stringify({ type: AUTH_FAILED, message: 'Auth failed' }));
    ws.close();
  }
};
