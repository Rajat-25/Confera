import { WS_CONST } from '@repo/lib';
import { GenPayloadType, UserContextType } from '@repo/types';
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { chatAuth } from './chat/chatAuth.js';
import { chatHandler } from './chat/chatHandler.js';
import { DisconnectHandler } from './chat/disconnectHandler.js';
import { userStatus } from './chat/userStatus.js';

declare module 'ws' {
  interface WebSocket {
    userContext?: UserContextType;
  }
}

type ContactsDbType = {
  phone: string;
};

const {
  AUTH_INIT,
  AUTH_SUCCESS,
  AUTH_FAILED,
  CHAT,
  USER_STATUS,
  ERROR,
  DISCONNECT,
} = WS_CONST;

export class WsChatSingleton {
  private static instance: WsChatSingleton | null = null;
  private ClientMapping: Map<string, WebSocket> = new Map();
  private wss: WebSocketServer | null = null;

  private constructor(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', async (ws: WebSocket) => {
      ws.on('message', async (val) => {
        try {
          const data = JSON.parse(val.toString());
          const { type, payload } = data;
          const { userContext } = ws;

          if (type === AUTH_INIT && !userContext) {
            await chatAuth({
              ws,
              payload,
              ClientMapping: this.ClientMapping,
              broadcastStatusToContacts: this.broadcastStatusToContacts,
            });
          } else if (type === CHAT && userContext?.userId) {
            await chatHandler({
              ws,
              payload,
              userContext,
              ClientMapping: this.ClientMapping,
              sendMsgToClient: this.sendMsgToClient.bind(this),
            });
          } else if (type == USER_STATUS) {
            await userStatus({
              ClientMapping: this.ClientMapping,
              payload,
              ws,
            });
          } else if (type == DISCONNECT) {
            await DisconnectHandler();
          }
        } catch (err: any) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error('WS Error ❌:', msg);

          ws.send(
            JSON.stringify({ type: ERROR, message: 'Internal Server error' })
          );
        }
      });

      ws.on('error', (err) => {
        console.log('Error', err);
      });

      ws.on('close', () => {
        console.log(`Client ${ws.userContext?.userId} disconnected ❌`);

        if (ws.userContext) {
          this.ClientMapping.forEach((socket, phone) => {
            if (socket === ws) this.ClientMapping.delete(phone);
          });
          ws.userContext = undefined;
        }
      });
    });
  }

  private sendMsgToClient(receiverClient: WebSocket, payload: GenPayloadType) {
    if (receiverClient.readyState === WebSocket.OPEN) {
      receiverClient.send(JSON.stringify(payload));
    }
  }

  private broadcastStatusToContacts(contacts: ContactsDbType[], phone: string) {
    const userStatusPayload = {
      statusOf: phone,
      status: 'online',
    };

    contacts.forEach((contact) => {
      const receiverClient = this.ClientMapping.get(contact.phone);
      if (receiverClient && receiverClient?.readyState === WebSocket.OPEN) {
        receiverClient.send(
          JSON.stringify({
            type: USER_STATUS,
            payload: userStatusPayload,
          })
        );
      }
    });
  }

  static getInstance(server: Server) {
    if (!this.instance) {
      this.instance = new WsChatSingleton(server);
    }
  }
}
