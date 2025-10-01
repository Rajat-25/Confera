import 'ws';
import { UserContextType } from '@repo/types';

declare module 'ws' {
  interface WebSocket {
    userContext?: UserContextType ;
  }
}
