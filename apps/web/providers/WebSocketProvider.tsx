'use client';
import { WS_CONST } from '@repo/lib';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

let reconnectTimer: NodeJS.Timeout;

const WebSocketProvider = () => {
  const { status } = useSession();
  const dispatch = useDispatch();
  const { CONNECT, DISCONNECT } = WS_CONST;

  useEffect(() => {
    const init = async () => {
      console.log('Initiate WS Connection Request ');

      try {
        const { data } = await axios.get('/api/ws-token');

        if (!data?.success || !data?.token) {
          console.log('unauthenticated');
          return;
        }

        const token = data?.token;

        dispatch({ type: CONNECT, payload: { jwtToken: token } });

        const { exp } = jwtDecode<{ exp: number }>(token);
        const now = Date.now();
        const msUntilExpiry = exp * 1000 - now;

        reconnectTimer = setTimeout(() => {
          dispatch({ type: DISCONNECT });
          init();
        }, msUntilExpiry - 5000);
      } catch (err) {
        console.log('Client Auth initialisation failed:', err);
      }
    };

    if (status === 'authenticated') init();

    return () => {
      console.log('WebSocket Disconnected');
      clearTimeout(reconnectTimer);
      dispatch({ type: DISCONNECT });
    };
    
  }, [status]);

  return null;
};

export default WebSocketProvider;
