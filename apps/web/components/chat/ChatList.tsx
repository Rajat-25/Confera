'use client';
import {
  clearChatSliceState,
  RootState,
  setConversationMap,
  setCurrentChatContact,
  setMappedContacts,
} from '@/store';
import { ChatListPropsType, CurrentChatContactType } from '@repo/types';
import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

const ChatList = ({
  dbMappedContacts,
  dbMappedConversations,
  userId,
}: ChatListPropsType) => {
  const dispatch = useDispatch();
  const [inputText, setInputText] = useState<string>('');

  const { mappedContacts } = useSelector(
    (state: RootState) => state.contact_slice
  );

  const { mappedConversation } = useSelector(
    (state: RootState) => state.chat_slice
  );

  const onClickHandlder = (data: CurrentChatContactType) => {
    console.log('inside onClickHandlder  func ....');

    if (!data) return;
    dispatch(setCurrentChatContact(data));
  };

  useEffect(() => {
    console.log('mapped contact/conversation effect running ....');

    if (dbMappedContacts && dbMappedConversations) {
      dispatch(setConversationMap(dbMappedConversations));
      dispatch(setMappedContacts(dbMappedContacts));
    }
  }, [dbMappedContacts, dbMappedConversations]);

  useEffect(() => {
    console.log('clearChatState effect running ....');

    return () => {
      dispatch(clearChatSliceState());
    };
  }, []);

  return (
    <div className=' py-4 px-8 bg-secondary-bg text-secondary-text col-span-4 rounded-xl flex flex-col gap-y-3'>
      <div className='focus-within:ring-2 rounded-xl focus:ring-secondary flex items-center gap-x-2 p-3 shadow-sm shadow-slate-800 text-secondary-text'>
        <FiSearch size={20} className='text-xl' />
        <input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          type='text'
          className='w-full focus:outline-none text-base bg-secondary-bg'
          placeholder='Search by name or phone...'
        />
      </div>
      {Object.keys(mappedConversation).length === 0 ? (
        <div className='flex  flex-col gap-y-2 items-center justify-center h-full '>
          <p className='text-tertiary-text font-semibold text-lg'>
            No conversations yet
          </p>
          <p className='text-tertiary-text font-semibold'>
            Start a chat to see it here
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-y-2'>
          {Object.entries(mappedConversation).map(([phone, conversation]) => {
            const isSentByMe = conversation?.lastMessageById === userId;
            const receiverData = mappedContacts[phone] || {
              fullName: 'Unknown',
              phone,
            };

            return (
              <div
                key={conversation.id}
                onClick={() => onClickHandlder(receiverData)}
                className=' shadow-md dark:shadow-gray-700 h-full px-6 py-3  rounded-xl bg-tertiary-bg flex justify-between items-center'
              >
                <div className=' w-full flex flex-col gap-y-1'>
                  <div className='text-lg font-semibold'>
                    {receiverData.fullName === 'Unknown'
                      ? '+91 ' + phone
                      : receiverData.fullName}
                  </div>
                  <div className=' flex justify-between items-center  text-sm text-gray-400'>
                    <span>
                      {isSentByMe ? 'You: ' : ''}
                      {conversation.lastMessage}
                    </span>
                    <span className='flex flex-row justify-end text-xs text-gray-500'>
                      {conversation?.lastMessageAt &&
                        new Date(conversation.lastMessageAt).toLocaleTimeString(
                          [],
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;
