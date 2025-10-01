import { GetUserContacts } from '@/app/actions/contact';
import DashboardClient from '@/components/dashboard/DashboardClient';

const page = async () => {
  const { success: contactSuccess, data: contactData } =
    await GetUserContacts();

  return (
    <div className='bg-primary-bg w-full h-full p-4 '>
      <div className='h-full bg-secondary-bg py-5 px-10  flex flex-col gap-y-4  rounded-xl'>
        {contactSuccess && contactData ? (
          <DashboardClient contacts={contactData} />
        ) : (
          <div className='flex flex-1 justify-center items-center  '>
            <div className='font-semibold text-tertiary-text'>
              Something Went Wrong !
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
