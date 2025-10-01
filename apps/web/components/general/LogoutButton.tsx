'use client';
import { WS_CONST } from '@repo/lib';
import { Button } from '@repo/ui/button';
import { signOut } from 'next-auth/react';
import { useDispatch } from 'react-redux';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch({ type: WS_CONST.DISCONNECT });
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
