'use client';
import { WS_CONST } from '@repo/lib';
import { connectSchemaType } from '@repo/types';
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

  const initiateSocketConnection = async () => {
    console.log('inside initiateSocketConnection ....');

    try {
      const { data } = await axios.get('/api/ws-token');

      if (!data?.success || !data?.token) {
        console.log('unauthenticated ....');
        return;
      }

      const token = data?.token;

      const connectPayload: connectSchemaType = {
        type: CONNECT,
        payload: { jwtToken: token },
      };

      dispatch(connectPayload);

      const { exp } = jwtDecode<{ exp: number }>(token);
      const now = Date.now();
      const msUntilExpiry = exp * 1000 - now;

      reconnectTimer = setTimeout(() => {
        dispatch({ type: DISCONNECT });
        initiateSocketConnection();
      }, msUntilExpiry - 5000);
    } catch (err) {
      console.log('Error in initiateSocketConnection  ....', err);
    }
  };

  useEffect(() => {
    console.log('webSocket effect runnning ....');
    if (status === 'authenticated') initiateSocketConnection();

    return () => {
      console.log('webSocket Disconnected ....');
      clearTimeout(reconnectTimer);
      dispatch({ type: DISCONNECT });
    };
  }, [status]);

  return null;
};

export default WebSocketProvider;
