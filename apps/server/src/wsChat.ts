import { WS_CONST } from '@repo/lib';
import { GenPayloadType } from '@repo/types';
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { chatAuth } from './chat/chatAuth';
import { chatHandler } from './chat/chatHandler';
import { disconnectHandler } from './chat/disconnectHandler';
import { userStatus } from './chat/userStatus';
import { broadcastStatusToContactsPropsType } from './types';
import { typingHandler } from './chat/typingHandler';

const { AUTH_INIT, CHAT, TYPING, USER_STATUS, ERROR, DISCONNECT } = WS_CONST;

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

          if (type === AUTH_INIT && !ws.userContext) {
            await chatAuth({
              ws,
              payload,
              ClientMapping: this.ClientMapping,
              broadcastStatusToContacts:
                this.broadcastStatusToContacts.bind(this),
            });
          } else if (type === CHAT && ws.userContext?.userId) {
            await chatHandler({
              ws,
              payload,
              ClientMapping: this.ClientMapping,
              sendMsgToClient: this.sendMsgToClient.bind(this),
            });
          } else if (type == USER_STATUS) {
            await userStatus({
              ClientMapping: this.ClientMapping,
              payload,
              ws,
            });
          } else if (type === TYPING) {
            typingHandler({ ws, ClientMapping: this.ClientMapping, payload });
          } else if (type == DISCONNECT) {
            await disconnectHandler({
              ws,
              broadcastStatusToContacts:
                this.broadcastStatusToContacts.bind(this),
            });
          }
        } catch (err: any) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error('WS Error ❌:', msg);

          return ws.send(
            JSON.stringify({ type: ERROR, message: 'Internal Server error' })
          );
        }
      });

      ws.on('error', (err) => {
        console.log('Error', err);
      });

      ws.on('close', () => {
        console.log(`User ${ws.userContext?.phone} disconnected ❌`);

        if (ws.userContext) {
          this.ClientMapping.delete(ws.userContext.phone);
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

  private broadcastStatusToContacts({
    contacts,
    status,
    phone,
  }: broadcastStatusToContactsPropsType) {
    contacts.forEach((contact: any) => {
      const receiverClient = this.ClientMapping.get(contact.phone);
      if (receiverClient && receiverClient?.readyState === WebSocket.OPEN) {
        receiverClient.send(
          JSON.stringify({
            type: USER_STATUS,
            payload: {
              statusOf: phone,
              status,
            },
          })
        );
      }
    });
    return;
  }

  static getInstance(server: Server) {
    if (!this.instance) {
      this.instance = new WsChatSingleton(server);
    }
  }
}
