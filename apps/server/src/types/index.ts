import { SendMsgPayloadType, TypingPayloadType } from '@repo/types';

import { WebSocket } from 'ws';

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
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (ws: WebSocket, data: any) => void;
};

export type CreateOfferPropsType = {
  ws: WebSocket;
  clientMapping: Map<string, WebSocket>;
  payload: { sdp: RTCSessionDescriptionInit; receiver: string };
};

export type createAnswerPropsType = {
  ws: WebSocket;
  payload: { sdp: RTCSessionDescriptionInit; receiver: string };
  clientMapping: Map<string, WebSocket>;
};

export type TypingHandlerPropsType = {
  ws: WebSocket;
  clientMapping: Map<string, WebSocket>;
  payload: TypingPayloadType;
};

export type AddIceCandidatePropsType = {
  ws: WebSocket;
  payload: { candidates: RTCIceCandidate[]; receiver: string };
  clientMapping: Map<string, WebSocket>;
};

export type CallActivityHandlerPropsType = {
  type: string;
  ws: WebSocket;
  payload: any;
  callStatus: Map<string, 'idle' | 'inCall'>;
  clientMapping: Map<string, WebSocket>;
};

export type ChatServicePropsType = {
  ws: WebSocket;
  payload: any;
  clientMapping: Map<string, WebSocket>;
  sendMsgToClient: (ws: WebSocket, data: any) => void;
  type: string;
};

export type CallServicePropsType = {
  ws: WebSocket;
  payload: any;
  type: string;
  clientMapping: Map<string, WebSocket>;
  callStatus: Map<string, 'idle' | 'inCall'>;
};

export type GetUserParamsType = {
  userId?: string;
  phone?: string;
};

export type UserStatusType = {
  clientMapping: Map<string, WebSocket>;
  ws: WebSocket;
  payload: { phone: string };
};

export type GeneralResponseType = {
  success: boolean;
  message: string;
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
