import { WebSocket } from 'ws';
import {
  GeneralResponseType,
  TypingPayloadType,
} from './client';
import { SendMsgPayloadType } from './zodSchema';

export interface UserContextType {
  userId: string;
  phone: string;
}

declare module 'ws' {
  interface WebSocket {
    userContext?: UserContextType;
  }
}
export type ContactsDbType = {
  phone: string;
};

export type GenPayloadType = {
  type: string;
  payload: any;
};

export type SendMsgToClientType = GenPayloadType & {
  client: WebSocket;
};

export type broadcastStatusToContactsPropsType = {
  contacts: ContactsDbType[];
  status: string;
  phone: string;
};

export type ChatAuthPropsType_S = {
  ws: WebSocket;
  payload: any;
  clientMapping: Map<string, WebSocket>;
  broadcastStatusToContacts: (
    props: broadcastStatusToContactsPropsType
  ) => void;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type ChatHandlerPropsType = {
  ws: WebSocket;
  payload: SendMsgPayloadType;
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type DisconnectHandlerPropsType = {
  ws: WebSocket;
  broadcastStatusToContacts: (
    props: broadcastStatusToContactsPropsType
  ) => void;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type CreateOfferPropsType = {
  ws: WebSocket;
  payload: { sdp: RTCSessionDescriptionInit; receiver: string };
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type createAnswerPropsType = {
  ws: WebSocket;
  payload: { sdp: RTCSessionDescriptionInit; receiver: string };
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type TypingHandlerPropsType = {
  ws: WebSocket;
  clientMapping: Map<string, WebSocket>;
  payload: TypingPayloadType;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type AddIceCandidatePropsType = {
  ws: WebSocket;
  payload: { candidates: RTCIceCandidate[]; receiver: string };
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type CallActivityHandlerPropsType = {
  type: string;
  ws: WebSocket;
  payload: any;
  callStatus: Map<string, 'idle' | 'inCall'>;
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type ChatServicePropsType = {
  ws: WebSocket;
  type: string;
  payload: any;
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type CallServicePropsType = {
  ws: WebSocket;
  payload: any;
  type: string;
  clientMapping: Map<string, WebSocket>;
  callStatus: Map<string, 'idle' | 'inCall'>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};

export type UserStatusType = {
  ws: WebSocket;
  payload: { phone: string };
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (props: SendMsgToClientType) => void;
};



export type GetContactsResponseType = GeneralResponseType & {
  data?: ContactsDbType[];
};

export type GetUserResponseType = GeneralResponseType & {
  data?: {
    id: string;
    phone: string | null;
    name: string;
  };
};
