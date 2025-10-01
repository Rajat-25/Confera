import { SendMsgPayloadType, TypingPayloadType, UserContextType } from '@repo/types';
import { WebSocket } from 'ws';




export type ContactsDbType = {
  phone: string;
};

export type broadcastStatusToContactsPropsType = {
  contacts: ContactsDbType[];
  status: string;
  phone: string;
};

export type ChatAuthPropsType_S = {
  ws: WebSocket;
  payload: any;
  ClientMapping: Map<string, WebSocket>;
  broadcastStatusToContacts: (
    props: broadcastStatusToContactsPropsType
  ) => void;
};

export type DisconnectHandlerPropsType = {
  ws: WebSocket;
  broadcastStatusToContacts: (
    props: broadcastStatusToContactsPropsType
  ) => void;
};

export type ChatHandlerPropsType = {
  ws: WebSocket;
  payload: SendMsgPayloadType;
  ClientMapping: Map<string, WebSocket>;
  sendMsgToClient: (ws: WebSocket, data: any) => void;
};


export type TypingHandlerPropsType = {
  ws: WebSocket;
  ClientMapping: Map<string, WebSocket>;
  payload: TypingPayloadType;
};