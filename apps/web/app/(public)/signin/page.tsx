import Image from 'next/image';
import GoogleSignInButton from '../../../components/SignIn_Google_Button';

const signin = () => {
  return (
    <div className=' h-full grid grid-cols-12 bg-primary-bg'>
      <div className='px-4  flex flex-col gap-y-8 justify-center  col-span-6'>
        <h2 className='text-white text-6xl font-semibold'>
          <p className='text-primary-btn'>Real-Time Conversations,</p>
          Made Simple
        </h2>
        <GoogleSignInButton />
      </div>
      <div className='bg-primary-bg relative col-span-6'>
        <Image
          src='/home_img4.png'
          alt='home_page_image'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
};

export default signin;
