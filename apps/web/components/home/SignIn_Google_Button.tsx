'use client';

import { urlPath } from '@repo/lib';
import { Button } from '@repo/ui';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignInButton = () => {
  const { dashboard } = urlPath;

  const signInHandler = async () => {
    await signIn('google', { callbackUrl: dashboard });
  };

  return (
    <Button
      onClick={signInHandler}
      className='w-fit flex items-center gap-x-4   px-6 py-3  text-xl font-medium text-secondary-text rounded-full border-4 border-primary-border transition-all duration-500  ease-in-out hover:scale-110 hover:text-primary-text bg-primary-bg'
    >
      Sign In with Google
      <FcGoogle className='text-2xl' />
    </Button>
  );
};

export default GoogleSignInButton;
