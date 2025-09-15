'use client';
import { Button } from '@repo/ui/button';
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  const logoutHandler = () => {
    signOut({ redirectTo: '/' });
  };

  return (
    <Button
      onClick={logoutHandler}
      className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
