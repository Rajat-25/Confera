import Image from 'next/image';
import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';

const page = () => {
  return (
    <div className=' h-full grid grid-cols-12 bg-primary-bg'>
      <div className='px-4  flex flex-col gap-y-8 justify-center  col-span-6'>
        <h2 className='text-primary-text text-6xl font-semibold'>
          <p className='text-primary-btn'>Real-Time Conversations,</p>
          Made Simple
        </h2>
        <Link
          href={'/signin'}
          className='w-fit flex items-center gap-x-4   px-6 py-3  text-xl font-medium text-secondary-text rounded-full border-4 border-primary-border transition-all duration-500  ease-in-out hover:scale-110 hover:text-primary-text bg-primary-bg'
        >
          Get Started
          <LuArrowRight className='text-2xl' />
        </Link>
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

export default page;
