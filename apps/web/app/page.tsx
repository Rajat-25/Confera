import { HomeSection } from '@/components/home/HomeSection';
import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';

const page = () => {
  return (
    <HomeSection>
      <Link
        href={'/signin'}
        className='w-fit flex items-center gap-x-4   px-6 py-3  text-xl font-medium text-secondary-text rounded-full border-4 border-primary-border transition-all duration-500  ease-in-out hover:scale-110 hover:text-primary-text bg-primary-bg'
      >
        Get Started
        <LuArrowRight className='text-2xl' />
      </Link>
    </HomeSection>
  );
};

export default page;
