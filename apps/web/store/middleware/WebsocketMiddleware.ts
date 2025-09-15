import { WS_CONST } from '@repo/lib';
import { Middleware } from '@reduxjs/toolkit';
import {
  addToConversationMap,
  addToCurrentChat,
  setWsConnectionStatus,
  store,
  updateContactStatus,
} from '..';
import {
  ChatType,
  NewConversationPayload,
  SendMsgPayloadType,
} from '@repo/types';

let wsClient: WebSocket | null;

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
          case TYPING:
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
              type: CHAT,
              payload: clientPayload,
            })
          );
          break;

        case TYPING:
          break;
        case USER_STATUS:
          wsClient.send(
            JSON.stringify({
              type: USER_STATUS,
              payload: {
                phone: action.payload.phone,
              },
            })
          );
          break;
        case DISCONNECT:
          wsClient.close();
          wsClient = null;
          store.dispatch(setWsConnectionStatus(false));
          break;
      }
    }

    return next(action);
  };
