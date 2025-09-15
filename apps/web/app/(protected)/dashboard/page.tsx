'use client';
import { GetUserContacts } from '@/app/actions/contact';
import { setCurrentChatContact, setUserContacts } from '@/store';
import { urlPath } from '@repo/lib';
import { userContactType } from '@repo/types';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { FiMessageCircle, FiSearch, FiVideo } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

const page = () => {
  const router = useRouter();
  const [inputText, setInputText] = useState<string>('');
  const [contacts, setContacts] = useState<any[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContacts = async () => {
      const { success, contacts } = await GetUserContacts();

      if (success) {
        setContacts(contacts);
        dispatch(setUserContacts(contacts));
      }
    };

    fetchContacts();
  }, []);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const filteredContacts = contacts.filter((item) => {
    return (
      item.fullName.toLowerCase().includes(inputText.toLowerCase()) ||
      item.phone.toLowerCase().includes(inputText.toLowerCase())
    );
  });

  const currentChatContactHandler = (contact: userContactType) => {
    dispatch(setCurrentChatContact(contact));
    router.push(urlPath.chat);
  };

  return (
    <div className='w-full p-4 bg-primary-bg'>
      <div className='py-5 px-10  flex flex-col gap-y-4 bg-secondary-bg rounded-xl'>
        <div className='focus-within:ring-2 rounded-xl focus:ring-secondary flex items-center gap-x-2 p-3 shadow-sm shadow-slate-800 text-secondary-text'>
          <FiSearch size={20} className='text-xl' />
          <input
            onChange={onChangeHandler}
            type='text'
            className='w-full focus:outline-none text-base bg-secondary-bg'
            placeholder='Search by name or phone...'
          />
        </div>

        {filteredContacts.map((item) => {
          return (
            <div
              key={item.id}
              className='transition-all ease-in-out duration-700 hover:bg-gray-800 hover:scale-105 flex justify-between p-4  text-secondary-text bg-secondary-bg rounded-xl'
            >
              <div className='flex gap-x-4 items-center'>
                <span className='w-3 h-3 bg-green-500 rounded-full'></span>
                <div className='flex flex-col gap-y-1'>
                  <div className='font-semibold text-secondary-text text-base'>
                    {item.fullName}
                  </div>
                  <span className='text-xs text-secondary-text'>
                    {item.phone}
                  </span>
                </div>
              </div>

              <div className='flex gap-x-4'>
                <div onClick={() => currentChatContactHandler(item)}>
                  <FiMessageCircle
                    strokeWidth={3}
                    className='text-secondary-text hover:text-secondary  hover:scale-110'
                    size={24}
                  />
                </div>
                <FiVideo
                  strokeWidth={3}
                  className='text-secondary-text font-bold hover:text-primary hover:scale-110'
                  size={24}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
