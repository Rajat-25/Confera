'use client';

import { RootState } from '@/store';
import { urlPath } from '@repo/lib';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import CallView from './CallView';

const CallStatusInfo = ({ message }: { message: string }) => {
  const route = useRouter();
  if (message !== 'Connecting ... !') {
    setTimeout(() => route.push(urlPath.dashboard), 1500);
  }

  return (
    <div className='h-full flex items-center justify-center bg-primary-bg text-tertiary-text'>
      <p className='text-lg font-medium opacity-70'>{message}</p>
    </div>
  );
};

const CallClient = () => {
  const { currentCallContact, callState } = useSelector(
    (state: RootState) => state.call_slice
  );

  const phone = currentCallContact?.phone;

  if (!currentCallContact || !phone) {
    return <CallStatusInfo message='No contact selected!' />;
  } else if (callState === 'initiated') {
    return <CallStatusInfo message='Connecting ... !' />;
  } else if (callState === 'user_offline') {
    return <CallStatusInfo message='User is Offline !' />;
  } else if (callState === 'user_busy') {
    return <CallStatusInfo message='User Is Busy!' />;
  } else if (callState === 'call_error') {
    return <CallStatusInfo message='Something went wrong!' />;
  } else if (callState === 'rejected') {
    return <CallStatusInfo message=' User is not answering the call!' />;
  } else if (callState === 'invalid_user') {
    return <CallStatusInfo message='Invalid User!' />;
  }
  return <CallView phone={phone} />;
};

export default CallClient;
