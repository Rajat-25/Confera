import { FiMail, FiPhone, FiUser } from 'react-icons/fi';

import DeleteButton_Cl from './DeleteButton_Cl';
import EditButton_CL from './Edit_Button_CL';
import { ContactListPropsType } from '@repo/types';

const ContactList = ({ userContacts }: ContactListPropsType) => {
  return (
    <>
      {userContacts.map((item) => {
        const { email, fullName, id, phone } = item;

        return (
          <div
            key={id}
            className='flex flex-col bg-secondary-bg sm:flex-row sm:items-center justify-between rounded-2xl px-4 py-2  hover:scale-105 transition-all duration-500 '
          >
            <div className='flex items-center gap-x-6'>
              <div className='bg-primary text-secondary-text rounded-full p-3'>
                <FiUser size={22} />
              </div>

              <div className='flex flex-col gap-y-1'>
                <h3 className='text-lg font-semibold text-secondary-text'>
                  {fullName}
                </h3>
                <div className='flex items-center gap-x-2 text-secondary-text text-sm'>
                  <FiMail size={16} /> <span>{email}</span>
                </div>
                <div className='flex items-center gap-x-2 text-secondary-text text-sm'>
                  <FiPhone size={16} /> <span>{phone}</span>
                </div>
              </div>
            </div>

            <div className='flex gap-x-2 '>
              <DeleteButton_Cl id={item.id} />
              <EditButton_CL item={item} />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ContactList;
