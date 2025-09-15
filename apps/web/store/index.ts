import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';
import { persistedReducer } from './persistState';
import { websocketMiddleware } from './middleware/WebsocketMiddleware';


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(websocketMiddleware),
});

export const persistedStore = persistStore(store);

export * from './slice/websocketSlice';
export * from './slice/chatSlice';
export * from './slice/contactSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
