'use client';
import {
  RootState,
  setCaller,
  setCurrentCallContact,
  setIncomingCallState,
} from '@/store';
import { CALL_CONST, urlPath } from '@repo/lib';
import { Call_GeneralPayloadType } from '@repo/types';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const CallNotification = () => {
  const { CALL_ACCEPTED, CALL_REJECTED, CALL_TIMEOUT } = CALL_CONST;

  const route = useRouter();
  const dispatch = useDispatch();

  const { caller, incomingCallState } = useSelector(
    (state: RootState) => state.call_slice
  );

  const acceptCall = () => {
    console.log('inside acceptCall func ....');
    
    if (!caller) return;

    const callAcceptPayload: Call_GeneralPayloadType = {
      receiverPhoneNo: caller,
    };

    dispatch({
      type: CALL_ACCEPTED,
      payload: callAcceptPayload,
    });

    dispatch(setCurrentCallContact({ phone: caller }));
    dispatch(setIncomingCallState(false));

    route.push(urlPath.call);
  };

  const commonAction = (type: string) => {
    console.log('inside commonAction func ....');

    if (!caller) return;

    const commonActionPayload: Call_GeneralPayloadType = {
      receiverPhoneNo: caller,
    };

    dispatch(setIncomingCallState(false));
    dispatch({
      type,
      payload: commonActionPayload,
    });
    dispatch(setCaller(null));
  };

  const rejectCall = () => commonAction(CALL_REJECTED);

  useEffect(() => {
    console.log('callTimeout effect running ....');

    if (!incomingCallState) return;

    const timer = setTimeout(() => commonAction(CALL_TIMEOUT), 15 * 1000);

    return () => clearTimeout(timer);
  }, [incomingCallState]);

  if (!incomingCallState) {
    return null;
  }

  return (
    incomingCallState && (
      <div className='w-full z-4 bg-primary-bg p-4 rounded-xl shadow-lg flex items-center justify-between '>
        <p className='font-medium'>{caller} is Calling...</p>
        <div className='flex gap-x-4'>
          <Button
            className='bg-blue-800 py-2 px-4 rounded-full'
            onClick={() => acceptCall()}
          >
            Accept
          </Button>
          <Button
            className='bg-red-800 py-2 px-4 rounded-full'
            onClick={() => rejectCall()}
          >
            Reject
          </Button>
        </div>
      </div>
    )
  );
};

export default CallNotification;
