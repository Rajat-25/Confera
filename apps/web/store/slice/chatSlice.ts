import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatSliceStateType,
  ChatType,
  ConversationPayload,
  CurrentChatContactType,
  MappedConversationType,
  TypingPayloadResponseType,
} from '@repo/types';

const initialState: ChatSliceStateType = {
  currentChat: [],
  currentChatContact: null,
  mappedConversation: {},
  isUserTyping: false,
};

const chatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    setIsUserTyping: (
      state,
      action: PayloadAction<TypingPayloadResponseType>
    ) => {
      state.isUserTyping = action.payload.isTyping;
    },
    setCurrentChatContact: (
      state,
      action: PayloadAction<CurrentChatContactType>
    ) => {
      state.currentChatContact = action.payload;
    },

    setConversationMap: (
      state,
      action: PayloadAction<MappedConversationType>
    ) => {
      state.mappedConversation = { ...action.payload };
    },
    addToConversationMap: (
      state,
      action: PayloadAction<ConversationPayload>
    ) => {
      const { phone, conversation } = action.payload;
      state.mappedConversation[phone] = {
        ...state.mappedConversation[phone],
        ...conversation,
      };
    },

    

    addToCurrentChat: (state, action: PayloadAction<ChatType>) => {
      state.currentChat.push(action.payload);
    },

    setCurrentChat: (state, action: PayloadAction<ChatType[]>) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = [];
    },

    clearChatSliceState: (state) => {
      state.currentChat = [];
      state.currentChatContact = null;
      state.mappedConversation = {};
      state.isUserTyping = false;
    },
  },
});

export const {
  clearCurrentChat,
  setConversationMap,
  addToConversationMap,
  setCurrentChat,
  addToCurrentChat,
  setCurrentChatContact,
  clearChatSliceState,
  setIsUserTyping,
} = chatSlice.actions;

export default chatSlice;
