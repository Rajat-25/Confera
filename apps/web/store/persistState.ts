import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import ChatSlice from './slice/chatSlice';
import ContactSlice from './slice/contactSlice';
import WebsocketSlice from './slice/websocketSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [ChatSlice.name],
};

const rootReducer = combineReducers({
  [ContactSlice.name]: ContactSlice.reducer,
  [ChatSlice.name]: ChatSlice.reducer,
  [WebsocketSlice.name]:WebsocketSlice.reducer
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
