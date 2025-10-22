import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { websocketMiddleware } from './middleware/WebsocketMiddleware';
import { persistedReducer } from './persistState';


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(websocketMiddleware),
});

export const persistedStore = persistStore(store);

export * from './slice/callSlice';
export * from './slice/chatSlice';
export * from './slice/contactSlice';
export * from './slice/websocketSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
