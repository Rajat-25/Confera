import { CALL_CONST, CHAT_CONST, WS_CONST } from '@repo/lib';
import {
  broadcastStatusToContactsPropsType,
  SendMsgToClientType,
} from '@repo/types';
import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { callService } from '../call';
import { chatService } from '../chat';
import { authHandler } from './authHandler';
import { disconnectHandler } from './disconnectHandler';

const { AUTH_INIT, ERROR, DISCONNECT } = WS_CONST;
const { USER_STATUS } = CHAT_CONST;

export class WsCommunicationSingleton {
  private static instance: WsCommunicationSingleton | null = null;
  private wss: WebSocketServer | null = null;
  private clientMapping: Map<string, WebSocket> = new Map();
  private callStatus: Map<string, 'idle' | 'inCall'> = new Map();

  private constructor(server: Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', async (ws: WebSocket) => {
      ws.on('message', async (val) => {
        try {
          const data = JSON.parse(val.toString());
          const { type, payload } = data;

          if (type === AUTH_INIT && !ws.userContext) {
            await authHandler({
              ws,
              payload,
              clientMapping: this.clientMapping,
              sendMsgToClient: this.sendMsgToClient.bind(this),
              broadcastStatusToContacts:
                this.broadcastStatusToContacts.bind(this),
            });
          } else if (
            ws.userContext?.userId &&
            Object.keys(CHAT_CONST).includes(type)
          ) {
            chatService({
              ws,
              type,
              payload,
              clientMapping: this.clientMapping,
              sendMsgToClient: this.sendMsgToClient.bind(this),
            });
          } else if (
            ws.userContext?.userId &&
            Object.keys(CALL_CONST).includes(type)
          ) {
            await callService({
              ws,
              type,
              payload,
              callStatus: this.callStatus,
              clientMapping: this.clientMapping,
              sendMsgToClient: this.sendMsgToClient.bind(this),
            });
          } else if (type == DISCONNECT) {
            await disconnectHandler({
              ws,
              broadcastStatusToContacts:
                this.broadcastStatusToContacts.bind(this),
              sendMsgToClient: this.sendMsgToClient.bind(this),
            });
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error('WS Error ❌:', msg);

          this.sendMsgToClient({
            client: ws,
            type: ERROR,
            payload: { message: 'Internal Server error' },
          });

          return;
        }
      });

      ws.on('error', (err) => {
        console.error('Error', err);
      });

      ws.on('close', () => {
        console.log(`User ${ws.userContext?.phone} disconnected ❌`);

        if (ws.userContext) {
          this.clientMapping.delete(ws.userContext.phone);
          this.callStatus.delete(ws.userContext.phone);
          ws.userContext = undefined;
        }
      });
    });
  }

  private sendMsgToClient({ client, payload, type }: SendMsgToClientType) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, payload }));
    }
    return;
  }

  private broadcastStatusToContacts({
    contacts,
    status,
    phone,
  }: broadcastStatusToContactsPropsType) {
    contacts.forEach((contact: any) => {
      const receiverClient = this.clientMapping.get(contact.phone);
      if (receiverClient) {
        this.sendMsgToClient({
          client: receiverClient,
          type: USER_STATUS,
          payload: {
            statusOf: phone,
            status,
          },
        });
      }
    });
    return;
  }

  static getInstance(server: Server) {
    if (!this.instance) {
      this.instance = new WsCommunicationSingleton(server);
    }
  }
}
