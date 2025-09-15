import { GetUserContacts } from '@/app/actions/contact';
import { ToastContainer } from 'react-toastify';
import ContactForm from '../../../components/contact/ContactForm';
import ContactList from '../../../components/contact/ContactList';

const page = async () => {
  const { contacts } = await GetUserContacts();

  return (
    <div className='h-full text-primary-text  bg-primary-bg'>
      <div className='flex flex-col gap-y-4 p-4 h-full bg-primary-bg  '>
        <div>
          <h2>Your Contacts</h2>
        </div>

        <div className='h-full grid grid-cols-12'>
          <div className='flex flex-col  gap-y-4 col-span-7 px-4 border-primary-border  border-r-2 '>
            <ContactList userContacts={contacts} />
          </div>
          <div className='col-span-5 border-primary-border  border-l-2 px-2'>
            <ContactForm />
          </div>
        </div>
        <ToastContainer position='top-right' autoClose={2500} />
      </div>
    </div>
  );
};

export default page;
