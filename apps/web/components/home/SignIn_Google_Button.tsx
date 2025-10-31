'use client';

import { urlPath } from '@repo/lib';
import { Button } from '@repo/ui';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignInButton = () => {
  const { dashboard } = urlPath;

  const signInHandler = async () => {
    console.log('inside signInHandler func ....');

    try {
      await signIn('google', { callbackUrl: dashboard });
    } catch (err) {
      console.log('Error in signInHandler ....', err);
    }
  };

  return (
    <Button
      onClick={signInHandler}
      className='w-fit border-primary-border hover:text-primary-text bg-primary-bg text-secondary-text flex items-center gap-x-4 py-2 px-4   md:px-6 md:py-3  text-lg md:text-xl font-medium md:font-semibold  rounded-full border-2  transition-all duration-500  ease-in-out hover:scale-110 '
    >
      Sign In with Google
      <FcGoogle className='text-xl md:text-2xl' />
    </Button>
  );
};

export default GoogleSignInButton;
