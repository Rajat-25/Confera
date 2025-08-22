import { auth } from '@/auth';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const Navbar = async () => {
  const session = await auth();

  return (
    <div className='flex justify-center bg-primary-bg '>
      <div className='z-10 border-4 border-primary-border rounded-full flex items-center justify-center mt-2 px-6 py-2   gap-x-6     '>
        <Link
          href='/'
          className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
        >
          Home
        </Link>
          <Link
          href='/'
          className='text-secondary-text cursor-pointer hover:scale-110 text-xl font-medium transition-all ease-in-out duration-500  hover:text-secondary'
        >
          Sign In
        </Link>
        {session ? <LogoutButton /> : null}
      </div>
    </div>
  );
};

export default Navbar;
