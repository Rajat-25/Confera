export type ContactType = {
  fullName: string;
  email: string | null;
  phone: string;
  id: string;
};

export type GenPayloadType = {
  type: string;
  payload: any;
};

export type UserStatusPayloadType = {
  statusOf: string;
  status: 'online' | 'offline';
};

export type UserContactType = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
};

export type ContactListPropsType = {
  userContacts: UserContactType[];
};

export type ChatType = {
  text: string;
  id: string;
  createdAt: Date;
  senderId: string;
  conversationId: string;
};

export type CurrentChatContactType = {
  fullName: string;
  phone: string;
  email: string | null;
};

export type ChatSliceStateType = {
  currentChat: ChatType[];
  userChats: ChatType[];
  currentChatContact: CurrentChatContactType | null;
  conversationMap: Record<string, string>;
};

export type GetUserChatResponse = {
  success: boolean;
  message: string;
  chats?: ChatType[];
};

export type Status = 'online' | 'offline';

export type ContactSliceState = {
  editingContact: ContactType | null;
  userContacts: ContactType[] | null;
  contactStatus: Record<string, Status>;
};

export type ChatWindowProps = {
  userId: string;
  GetUserChat: (phone: string) => Promise<GetUserChatResponse>;
  conversationMapDB: Record<string, string>;
};

export type SendMsgPayloadType = {
  conversationId: string | undefined;
  receiverPhone: string;
  text: string;
};

export type ChatContentPropsType = {
  currChats: ChatType[] | undefined;
  userId: string;
};

export interface UserContextType {
  userId: string;
}

export type NewConversationPayload = {
  phone: string;
  conversationId: string;
};

export type GetAllConversationsIdResponse = {
  success: boolean;
  message: string;
  data?: Record<string, string>;
};

export type conversationType = {
  id: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  lastMessageById: string | null;
};

export type ConversationWithParticipants = conversationType & {
  participants: {
    name: string;
    phone: string | null;
    email: string | null;
  }[];
};

export type GetAllConversationsResponse = {
  success: boolean;
  message: string;
  data?: ConversationWithParticipants[];
};
