import { Middleware } from '@reduxjs/toolkit';
import { CALL_CONST, CHAT_CONST, WS_CONST } from '@repo/lib';
import {
  addToConversationMap,
  addToCurrentChat,
  setCaller,
  setCallState,
  setIceCandidateState,
  setIncomingCallState,
  setIsUserTyping,
  setRemoteAnswerState,
  setRemoteOfferState,
  setWsConnectionStatus,
  updateContactStatus,
} from '..';

let wsClient: WebSocket | null;
let typingTimeout: NodeJS.Timeout | null = null;

export const websocketMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const { CONNECT, AUTH_INIT, AUTH_SUCCESS, AUTH_FAILED, DISCONNECT, ERROR } =
      WS_CONST;

    const {
      CHAT_ERROR,
      CHAT,
      NEW_CONVERSATION,
      TYPING,
      UPDATE_CONVERSATION,
      USER_STATUS,
    } = CHAT_CONST;

    const {
      CREATE_ANSWER,
      CREATE_OFFER,
      ADD_ICE_CANDIDATE,
      INCOMING_CALL,
      INITIATE_CALL,
      USER_BUSY,
      CALL_REJECTED,
      CALL_ACCEPTED,
      CALL_TIMEOUT,
      CALL_ENDED,
      USER_OFFLINE,
      CALL_ERROR,
    } = CALL_CONST;

    const { type, payload: clientPayload } = action;

    if (type === CONNECT && !wsClient) {
      console.log('Client initiated connection request...');

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
            console.log('Client connection established ✔');
            store.dispatch(setWsConnectionStatus(true));
            break;
          case AUTH_FAILED:
            console.log('Auth Failed ❌', serverPayload.message);
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

          case CHAT_ERROR:
            console.log('Error\n', serverPayload.message);
            break;

          case USER_OFFLINE:
            store.dispatch(setCallState(serverPayload.status));
            break;

          case USER_BUSY:
            store.dispatch(setCallState(serverPayload.status));
            break;

          case CALL_ACCEPTED:
            store.dispatch(setCallState(serverPayload.status));
            break;

          case CALL_REJECTED:
            store.dispatch(setCallState(serverPayload.status));
            break;

          case INCOMING_CALL:
            store.dispatch(setIncomingCallState(true));
            store.dispatch(setCaller(serverPayload.sender));
            break;

          case CREATE_OFFER:
            store.dispatch(setRemoteOfferState(serverPayload.sdp));
            break;

          case CREATE_ANSWER:
            store.dispatch(setRemoteAnswerState(serverPayload.sdp));
            break;

          case ADD_ICE_CANDIDATE:
            store.dispatch(setIceCandidateState(serverPayload.candidates));
            break;

          case CALL_ENDED:
            store.dispatch(setCallState('ended'));
            break;

          case CALL_ERROR:
            console.log('Error', serverPayload.message);
            break;

          case ERROR:
            console.log('Client Error ❌', serverPayload.message);
            break;
        }
      };
      wsClient.onclose = () => {
        console.log('Client connection closed ❌');
        store.dispatch(setWsConnectionStatus(false));
        wsClient = null;
      };
      wsClient.onerror = (err) => {
        console.log('Client error:', err);
      };
    } else if (
      wsClient &&
      store.getState().websocket_Slice.wsConnectionStatus
    ) {
      switch (type) {
        case CHAT:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case TYPING:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;
        case USER_STATUS:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case DISCONNECT:
          store.dispatch(setWsConnectionStatus(false));
          wsClient.send(JSON.stringify({ type }));
          wsClient.close();
          wsClient = null;
          break;

        case INITIATE_CALL:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case CREATE_OFFER:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case CREATE_ANSWER:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case ADD_ICE_CANDIDATE:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case CALL_ACCEPTED:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case CALL_TIMEOUT:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case CALL_REJECTED:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;

        case CALL_ENDED:
          wsClient.send(JSON.stringify({ type, payload: clientPayload }));
          break;
      }
    }

    return next(action);
  };
