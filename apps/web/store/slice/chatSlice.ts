import {
  ChatSliceStateType,
  ChatType,
  CurrentChatContactType,
  NewConversationPayload,
  UserContactType,
} from '@repo/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ChatSliceStateType = {
  currentChat: [],
  userChats: [],
  conversationMap: {},
  currentChatContact: null,
};

const chatSlice = createSlice({
  name: 'chat_slice',
  initialState,
  reducers: {
    setConversationMap: (
      state,
      action: PayloadAction<Record<string, string>>
    ) => {
      state.conversationMap = action.payload;
    },

    addToConversationMap: (
      state,
      action: PayloadAction<NewConversationPayload>
    ) => {
      state.conversationMap[action.payload.phone] =
        action.payload.conversationId;
    },

    setCurrentChatContact: (
      state,
      action: PayloadAction<CurrentChatContactType>
    ) => {
      state.currentChatContact = action.payload;
    },

    setUserChats: (state, action: PayloadAction<ChatType[]>) => {
      state.userChats = action.payload;
    },

    addToCurrentChat: (state, action: PayloadAction<ChatType>) => {
      state.currentChat?.push(action.payload);
    },

    setCurrentChat: (state, action: PayloadAction<ChatType[]>) => {
      state.currentChat = action.payload;
    },
    clearCurrentChat: (state) => {
      state.currentChat = [];
    },

    clearChatState: (state) => {
      state.currentChat = [];
      state.userChats = [];
      state.conversationMap = {};
      state.currentChatContact = null;
    },
  },
});

export const {
  clearCurrentChat,
  setConversationMap,
  addToConversationMap,
  setUserChats,
  setCurrentChat,
  addToCurrentChat,
  setCurrentChatContact,
  clearChatState,
} = chatSlice.actions;

export default chatSlice;
