import { GetUserContacts } from '@/app/actions/contact';
import ContactForm from '@/components/contact/ContactForm';
import ContactList from '@/components/contact/ContactList';
import { ToastContainer } from 'react-toastify';

const page = async () => {
  const { success: contactSuccess, data: contactData } =
    await GetUserContacts();

  return (
    <div className='h-full bg-primary-bg '>
      <div className='h-full bg-primary-bg px-4 py-2 grid grid-cols-12 '>
        <div  className='col-span-7   flex flex-col overflow-y-auto bg-secondary-bg  gap-y-2 px-8 py-1  '>
          {contactSuccess && contactData && (
            <ContactList contacts={contactData} />
          )}
        </div>

        <div className='border-primary-border  col-span-5   px-2'>
          <ContactForm />
        </div>
      </div>
      <ToastContainer position='top-right' autoClose={2500} />
    </div>
  );
};

export default page;
