import { auth } from '@/auth';
import { urlPath } from '@repo/lib';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const Navbar = async () => {
  const session = await auth();
  const { home, dashboard, contacts, signin, chat } = urlPath;

  return (
    <div className='flex justify-center bg-primary-bg '>
      <div className='z-10 border-4 border-primary-border rounded-full flex items-center justify-center mt-2 px-6 py-2   gap-x-6     '>
        {session ? (
          <>
            <Link
              href={dashboard}
              className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
            >
              Dashboard
            </Link>

            <Link
              href={contacts}
              className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
            >
              Contacts
            </Link>

            <Link
              href={chat}
              className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
            >
              Chat
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link
              href={home}
              className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
            >
              Home
            </Link>
            <Link
              href={signin}
              className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
