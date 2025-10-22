import { GetUserContacts } from '@/app/actions/contact';
import ContactForm from '@/components/contact/ContactForm';
import ContactList from '@/components/contact/ContactList';
import { ToastContainer } from 'react-toastify';

const page = async () => {
  const { success: contactSuccess, data: contactData } =
    await GetUserContacts();

  return (
    <div className='bg-primary-bg h-full'>
      <div className='bg-primary-bg h-full  flex flex-col p-5'>
        <div className='h-full grid grid-cols-12'>
          <div className=' h-full flex flex-col  gap-y-4 col-span-7 px-4 border-primary-border  border-r-2 '>
            {contactSuccess && contactData && (
              <ContactList contacts={contactData} />
            )}
          </div>
          <div className='border-primary-border  col-span-5  border-l-2 px-2'>
            <ContactForm />
          </div>
        </div>
        <ToastContainer position='top-right' autoClose={2500} />
      </div>
    </div>
  );
};

export default page;
