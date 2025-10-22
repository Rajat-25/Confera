'use client';
import {
  RootState,
  setCaller,
  setCurrentCallContact,
  setIncomingCallState,
} from '@/store';
import { CALL_CONST, urlPath } from '@repo/lib';
import { Button } from '@repo/ui/button';
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
    if (!caller) return;

    dispatch({
      type: CALL_ACCEPTED,
      payload: {
        receiverPhoneNo: caller,
      },
    });
    dispatch(setCurrentCallContact({ phone: caller }));
    dispatch(setIncomingCallState(false));

    route.push(urlPath.call);
  };

  const commonAction = (type: string) => {
    dispatch(setIncomingCallState(false));
    dispatch(setCaller(null));
    dispatch({
      type,
      payload: {
        receiverPhoneNo: caller,
      },
    });
  };

  const rejectCall = () => commonAction(CALL_REJECTED);

  useEffect(() => {
    if (!incomingCallState) return;

    const timer = setTimeout(() => commonAction(CALL_TIMEOUT), 20 * 1000);

    return () => clearTimeout(timer);
  }, [incomingCallState]);

  if (!incomingCallState) return null;

  return (
    incomingCallState && (
      <div className='w-full z-4 bg-primary-bg p-4 rounded-xl shadow-lg flex items-center justify-between '>
        <p>{caller} is Calling...</p>
        <div className='flex gap-2 mt-2'>
          <Button
            className='bg-blue-900 py-1 px-2 rounded-full'
            onClick={() => acceptCall()}
          >
            Accept
          </Button>
          <Button
            className='bg-red-900 py-1 px-2 rounded-full'
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
