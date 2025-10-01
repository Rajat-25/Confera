export const urlPath = {
  home: '/',
  signin: '/signin',
  dashboard: '/dashboard',
  contacts: '/contacts',
  chat: '/chat',
  addContact: 'add-contact',
};

export const WS_CONST = {
  AUTH_INIT: 'WS_AUTH_INIT',
  AUTH_SUCCESS: 'WS_AUTH_SUCCESS',
  AUTH_FAILED: 'WS_AUTH_FAILED',

  CONNECT: 'WS_CONNECT',
  DISCONNECT: 'WS_DISCONNECT',
  CLOSE: 'WS_CLOSE',
  ERROR: 'WS_ERROR',

  CHAT: 'WS_CHAT',
  USER_STATUS: 'WS_USER_STATUS',
  TYPING: 'WS_TYPING',
  NEW_CONVERSATION: 'WS_NEW_CONVERSATION',
  UPDATE_CONVERSATION: 'WS_UPDATE_CONVERSATION',
};
