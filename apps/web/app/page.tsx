import { HomeSection } from '@/components/home/HomeSection';
import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';

const page = () => {
  return (
    <HomeSection>
      <Link
        href={'/signin'}
        className='w-fit border-primary-border text-secondary-text hover:text-primary-text bg-primary-bg flex items-center gap-x-4  py-2 px-4 md:px-6 md:py-3  text-lg md:text-xl font-medium md:font-semibold rounded-full border-2   transition-all duration-500  ease-in-out hover:scale-110 '
      >
        Get Started
        <LuArrowRight className='text-xl md:text-2xl' />
      </Link>
    </HomeSection>
  );
};

export default page;
