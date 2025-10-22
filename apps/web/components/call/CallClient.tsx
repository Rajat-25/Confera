'use client';

import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import CallerView from './CallerView';
import ReceiverView from './ReceiverView';
import { useRouter } from 'next/navigation';
import { urlPath } from '@repo/lib';

const GeneralComponent = ({ message }: { message: string }) => {
  const route = useRouter();

  if (message === 'No contact selected!') {
    setTimeout(() => route.push(urlPath.dashboard), 1500);
  }

  return (
    <div className='h-full flex items-center justify-center bg-primary-bg text-tertiary-text'>
      <p className='text-lg font-medium opacity-70'>{message}</p>
    </div>
  );
};

const CallClient = () => {
  const { callInitiatedBy, currentCallContact, callState } = useSelector(
    (state: RootState) => state.call_slice
  );

  const phone = currentCallContact?.phone;

  if (!currentCallContact || !phone) {
    return <GeneralComponent message='No contact selected!' />;
  } else if (callState === 'initiated') {
    return <GeneralComponent message='Connecting ... !' />;
  } else if (callState === 'user_offline') {
    return <GeneralComponent message='User is Offline !' />;
  } else if (callState === 'user_busy') {
    return <GeneralComponent message='User Is Busy!' />;
  } else if (callState === 'call_error') {
    return <GeneralComponent message='Something went wrong!' />;
  } else if (callState === 'rejected') {
    return <GeneralComponent message=' User is not answering the call!' />;
  } else if (callState === 'invalid_user') {
    return <GeneralComponent message='Invalid User!' />;
  }
  return callInitiatedBy === 'Me' ? (
    <CallerView phone={phone} />
  ) : (
    <ReceiverView phone={phone} />
  );
};

export default CallClient;
