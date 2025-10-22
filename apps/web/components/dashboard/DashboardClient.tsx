'use client';
import {
  setCallInitiatedBy,
  setCallState,
  setCurrentCallContact,
  setCurrentChatContact,
} from '@/store';
import { CALL_CONST, urlPath } from '@repo/lib';
import { ContactType, DashboardClientProps } from '@repo/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react';
import { FiMessageCircle, FiSearch, FiVideo } from 'react-icons/fi';
import { LuArrowUpRight } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import CallNotification from '../CallNotification';

const DashboardClient = ({ contacts }: DashboardClientProps) => {
  const route = useRouter();
  const dispatch = useDispatch();
  const { INITIATE_CALL } = CALL_CONST;

  const [inputText, setInputText] = useState<string>('');

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const chatActionHandler = (contact: ContactType) => {
    dispatch(setCurrentChatContact(contact));
    route.push(urlPath.chat);
  };

  const callActionHandler = (contact: ContactType) => {
    dispatch(setCurrentCallContact({ phone: contact.phone }));
    dispatch(setCallInitiatedBy('Me'));
    dispatch(setCallState('initiated'));
    dispatch({
      type: INITIATE_CALL,
      payload: {
        receiverPhoneNo: contact.phone,
      },
    });

    route.push(urlPath.call);
  };

  const filteredContacts = contacts?.filter((item: ContactType) => {
    return (
      item.fullName.toLowerCase().includes(inputText.toLowerCase()) ||
      item.phone.toLowerCase().includes(inputText.toLowerCase())
    );
  });

  return (
    <>
      <div className='focus-within:ring-2 rounded-xl focus:ring-secondary flex items-center gap-x-2 p-3 shadow-sm shadow-slate-800 text-secondary-text'>
        <CallNotification />
        <FiSearch size={20} className='text-xl' />
        <input
          onChange={onChangeHandler}
          type='text'
          className='w-full focus:outline-none text-base bg-secondary-bg'
          placeholder='Search by name or phone...'
        />
      </div>
      {filteredContacts.length > 0 ? (
        filteredContacts.map((item: ContactType) => {
          return (
            <div
              key={item.id}
              className='transition-all ease-in-out duration-700 hover:bg-gray-800  flex justify-between items-center p-4  text-secondary-text bg-secondary-bg rounded-xl'
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

              <div className='flex gap-x-8'>
                <div onClick={() => chatActionHandler(item)}>
                  <FiMessageCircle
                    strokeWidth={3}
                    className='text-secondary-text hover:text-secondary  hover:scale-125 transition-all ease-in-out duration-300'
                    size={30}
                  />
                </div>
                <div onClick={() => callActionHandler(item)}>
                  <FiVideo
                    strokeWidth={3}
                    className=' text-secondary-text font-bold hover:text-primary hover:scale-125 transition-all ease-in-out duration-300 '
                    size={30}
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className='h-full flex  justify-center  items-center gap-x-4 '>
          <h3 className='text-xl font-semibold text-tertiary-text'>
            No contacts yet - add one !
          </h3>
          <Link
            className='hover:scale-110 flex items-center'
            href={urlPath.contacts}
          >
            <LuArrowUpRight
              size={25}
              className='scale-110 text-tertiary-text '
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default DashboardClient;
