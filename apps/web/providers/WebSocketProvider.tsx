'use client';
import { WS_CONST } from '@repo/lib';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const WebSocketProvider = () => {
  const { status } = useSession();
  const dispatch = useDispatch();
  const { CONNECT, DISCONNECT } = WS_CONST;

  useEffect(() => {
    const init = async () => {
      console.log('WS client Send connect request ');

      try {
        const { data } = await axios.get('/api/ws-token');

        if (!data?.success || !data?.responseData.token) {
          console.log('unauthenticated');
        }

        const { token } = await data.responseData;

        dispatch({ type: CONNECT, payload: { jwtToken: token } });
      } catch (err) {
        console.log('Client Auth initialisation failed:', err);
      }
    };

    if (status === 'authenticated') {
      init();
    }

    () => {
      console.log('WebSocket Disconnected');
      dispatch({ type: DISCONNECT });
    };
  }, [status]);

  return null;
};

export default WebSocketProvider;
