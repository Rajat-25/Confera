export type IsUserAuthorizedResponse = GeneralResponseType & {
  data?: {
    userId: string;
    userPhone: string | null | undefined;
  };
};

export type ContactType = {
  fullName: string;
  email: string | null;
  phone: string;
  id: string;
};

export type CurrentChatContactType = Pick<ContactType, 'fullName' | 'phone'>;

export type ContactListPropsType = {
  contacts: ContactType[];
};

export type GetUserContactsResponse = GeneralResponseType & {
  data: ContactType[] | null;
};

export type GenPayloadType = {
  type: string;
  payload: any;
};

export type StatusType = 'online' | 'offline';

export type UserStatusPayloadType = {
  statusOf: string;
  status: StatusType;
};

export type ContactSliceState = {
  editingContact: ContactType | null;
  userContacts: ContactType[] | null;
  contactStatus: Record<string, StatusType>;
  mappedContacts: MappedContactType;
};

export type ChatType = {
  text: string;
  id: string;
  createdAt: Date;
  senderId: string;
  conversationId: string;
};

export type GetUserChatResponse = {
  success: boolean;
  message: string;
  chats?: ChatType[];
};

export type ChatWindowProps = {
  userId: string;
  GetUserChat: (phone: string) => Promise<GetUserChatResponse>;
};

export type SendMsgPayloadType = {
  conversationId: string | null;
  receiverPhone: string;
  text: string;
};

export type ChatContentPropsType = {
  currChats: ChatType[] | undefined;
  userId: string;
};

export interface UserContextType {
  userId: string;
  phone: string;
}

export type GetAllConversationsIdResponse = {
  success: boolean;
  message: string;
  data: MappedConversationType | null;
};

export type ConversationType = {
  id: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  lastMessageById: string | null;
};

export type MappedConversationType = Record<string, ConversationType>;

export type ChatSliceStateType = {
  currentChat: ChatType[];
  userChats: ChatType[];
  currentChatContact: CurrentChatContactType | null;
  mappedConversation: MappedConversationType;
  isUserTyping: boolean;
};

export type ConversationPayload = {
  phone: string;
  conversation: ConversationType;
};

export type ConversationWithParticipants = ConversationType & {
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

export type GeneralResponseType = {
  success: boolean;
  message: string;
};

export type MappedContactType = Record<string, CurrentChatContactType>;

export type GetAllMappedContactsResponseType = GeneralResponseType & {
  data: MappedContactType | null;
};

export type JwtVerifyType = {
  sub: string;
  jti?: string;
  iat?: number;
  exp?: number;
};

export type ChatListPropsType = {
  dbMappedContacts: MappedContactType | null;
  dbMappedConversations: MappedConversationType | null;
  userId: string;
};

export type DashboardClientProps = {
  contacts: ContactType[];
};

export type TypingPayloadType = {
  phone: string;
};

export type TypingPayloadResponseType = {
  isTyping: boolean;
};
