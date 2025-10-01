import { Middleware } from '@reduxjs/toolkit';
import { WS_CONST } from '@repo/lib';
import {
  addToConversationMap,
  addToCurrentChat,
  setIsUserTyping,
  setWsConnectionStatus,
  updateContactStatus,
} from '..';

let wsClient: WebSocket | null;
let typingTimeout: NodeJS.Timeout | null = null;

export const websocketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const {
      CONNECT,
      AUTH_INIT,
      CHAT,
      USER_STATUS,
      TYPING,
      AUTH_SUCCESS,
      AUTH_FAILED,
      DISCONNECT,
      ERROR,
      NEW_CONVERSATION,
      UPDATE_CONVERSATION,
    } = WS_CONST;

    const { type, payload: clientPayload } = action;

    if (type === CONNECT && !wsClient) {
      console.log('WS Client Auth process started ...');

      wsClient = new WebSocket(process.env.NEXT_PUBLIC_WS_SERVER_URL || '');

      wsClient.onopen = () => {
        wsClient?.send(
          JSON.stringify({ type: AUTH_INIT, payload: clientPayload })
        );
      };

      wsClient.onmessage = (e) => {
        const data = JSON.parse(e.data);
        const { type, payload: serverPayload } = data;

        switch (type) {
          case AUTH_SUCCESS:
            console.log('WS Client connection established ✔');
            store.dispatch(setWsConnectionStatus(true));
            break;
          case AUTH_FAILED:
            console.log('Auth Failed ❌');
            store.dispatch(setWsConnectionStatus(false));
            wsClient?.close();
            break;
          case CHAT:
            store.dispatch(addToCurrentChat(serverPayload));
            break;
          case USER_STATUS:
            store.dispatch(updateContactStatus(serverPayload));
            break;
          case NEW_CONVERSATION:
            store.dispatch(addToConversationMap(serverPayload));
            break;
          case UPDATE_CONVERSATION:
            store.dispatch(addToConversationMap(serverPayload));
            break;
          case TYPING:
            store.dispatch(setIsUserTyping(serverPayload));
            if (serverPayload.isTyping) {
              if (typingTimeout) clearTimeout(typingTimeout);
              typingTimeout = setTimeout(() => {
                store.dispatch(setIsUserTyping({ isTyping: false }));
              }, 500);
            }
            break;
          case ERROR:
            console.log('WS Client Error ❌');
            break;
        }
      };
      wsClient.onclose = () => {
        console.log('WS Client connection closed ❌');
        store.dispatch(setWsConnectionStatus(false));
        wsClient = null;
      };
      wsClient.onerror = (err) => {
        console.log('WS error:', err);
      };
    } else if (
      wsClient &&
      store.getState().websocket_Slice.wsConnectionStatus
    ) {
      switch (type) {
        case CHAT:
          wsClient.send(
            JSON.stringify({
              type,
              payload: clientPayload,
            })
          );
          break;

        case TYPING:
          wsClient.send(
            JSON.stringify({
              type,
              payload: clientPayload,
            })
          );
          break;
        case USER_STATUS:
          wsClient.send(
            JSON.stringify({
              type,
              payload: clientPayload,
            })
          );
          break;
        case DISCONNECT:
          store.dispatch(setWsConnectionStatus(false));
          wsClient.send(
            JSON.stringify({
              type,
            })
          );
          wsClient.close();
          wsClient = null;
          break;
      }
    }

    return next(action);
  };
