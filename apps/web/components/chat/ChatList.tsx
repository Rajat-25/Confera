'use client';
import { setCurrentChatContact } from '@/store';
import {
  ConversationWithParticipants,
  CurrentChatContactType,
} from '@repo/types';
import { ChangeEvent, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDispatch } from 'react-redux';

const ChatList = ({ userPhone, conversations, userId }: any) => {
  const [inputText, setInputText] = useState<string>('');
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const dispatch = useDispatch();

  const onClickHandlder = (data: CurrentChatContactType | null) => {
    if (!data) return;
    dispatch(setCurrentChatContact(data));
  };

  return (
    <div className=' py-4 px-8 bg-secondary-bg text-secondary-text col-span-4 rounded-xl flex flex-col gap-y-3'>
      <div className='focus-within:ring-2 rounded-xl focus:ring-secondary flex items-center gap-x-2 p-3 shadow-sm shadow-slate-800 text-secondary-text'>
        <FiSearch size={20} className='text-xl' />
        <input
          onChange={onChangeHandler}
          type='text'
          className='w-full focus:outline-none text-base bg-secondary-bg'
          placeholder='Search by name or phone...'
        />
      </div>
      <div className='cursor-pointer flex flex-col gap-y-2'>
        {conversations.map((item: ConversationWithParticipants) => {
          const participant = item.participants[0];
          const isSentByMe = item.lastMessageById === userId;

          const data = participant
            ? {
                email: participant.email,
                phone: participant.phone,
                fullName: participant.name,
              }
            : null;

          return (
            <div
              key={item.id}
              onClick={() => onClickHandlder(data)}
              className=' shadow-md dark:shadow-gray-700 h-full px-6 py-3  rounded-xl bg-tertiary-bg flex justify-between items-center'
            >
              <div className=' w-full flex flex-col gap-y-1'>
                <div className='text-lg font-semibold'>{participant?.name}</div>
                <div className=' flex justify-between items-center  text-sm text-gray-400'>
                  <span>
                    {isSentByMe ? 'You: ' : ''}
                    {item.lastMessage}
                  </span>
                  <span className='flex flex-row justify-end text-xs text-gray-500'>
                    {item?.lastMessageAt &&
                      new Date(item.lastMessageAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
