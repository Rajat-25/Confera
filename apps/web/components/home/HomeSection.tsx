import Image from 'next/image';
import { ReactNode } from 'react';

export const HomeSection = ({ children }: { children: ReactNode }) => {
  return (
    <div className=' h-full grid grid-cols-1 md:grid-cols-12 bg-primary-bg'>
      <div className='px-4  flex flex-col gap-y-8 justify-center items-center md:items-start col-span-6 text-2xl font-medium md:text-6xl md:font-semibold' >
        <h2 className='text-primary-text '>
          <p className='text-primary-btn'>Real-Time Conversations,</p>
          Made Simple
        </h2>
        {children}
      </div>
      <div className='bg-primary-bg relative col-span-6 hidden md:block'>
        <Image
          src='/home.png'
          alt='home_page_image'
          fill
          className='object-cover'
          priority
        />
      </div>
    </div>
  );
};
