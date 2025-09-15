'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import WebSocketProvider from './providers/WebSocketProvider';
import { persistedStore, store } from './store';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null}  persistor={persistedStore}>
          <WebSocketProvider />
          {children}
        </PersistGate>
      </ReduxProvider>
    </SessionProvider>
  );
}
