'use client';
import { clearCurrentChat, RootState, setCurrentChat } from '@/store';
import { CHAT_CONST } from '@repo/lib';
import {
  ChatWindowProps,
  PhonePayloadType,
  SendMsgPayloadType,
  StatusType,
} from '@repo/types';
import { Button } from '@repo/ui';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatContent from './ChatContent';

const ChatWindow = ({ GetUserChat, userId }: ChatWindowProps) => {
  const { CHAT, USER_STATUS, TYPING } = CHAT_CONST;
  const dispatch = useDispatch();

  const [msg, setMsg] = useState<string>('');
  const [isUserOnline, setIsUserOnline] = useState<StatusType>('offline');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const { currentChatContact, mappedConversation, currentChat, isUserTyping } =
    useSelector((state: RootState) => state.chat_slice);

  const { wsConnectionStatus } = useSelector(
    (state: RootState) => state.websocket_Slice
  );

  const { contactStatus } = useSelector(
    (state: RootState) => state.contact_slice
  );

  const phone = currentChatContact?.phone;
  const fullName = currentChatContact?.fullName;

  const sendMsgHandler = () => {
    console.log('inside sendMsg Handler ....');

    if (!msg || !wsConnectionStatus || !phone) return;
    const conversation = mappedConversation?.[phone];

    const payload: SendMsgPayloadType = {
      receiverPhone: phone,
      conversationId: conversation?.id ?? null,
      text: msg,
    };

    dispatch({ type: CHAT, payload });

    setMsg('');
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('inside onChangeHandler func ...');

    setMsg(e.target.value);

    if (!phone) return;

    if (typingRef.current) clearTimeout(typingRef.current);

    const typingPayload: PhonePayloadType = {
      phone,
    };

    typingRef.current = setTimeout(() => {
      dispatch({
        type: TYPING,
        payload: typingPayload,
      });
    }, 200);
  };

  const getMyChats = async (phone: string) => {
    console.log('inside getMyChats  func ...');

    const { success, chats } = await GetUserChat(phone);
    if (success && chats && chats.length !== 0) {
      dispatch(setCurrentChat(chats));
    }
  };

  const getUserStatus = () => {
    console.log('inside getUserStaus function ....');

    if (!phone) return;

    const userStatusPayload: PhonePayloadType = { phone };
    dispatch({ type: USER_STATUS, payload: userStatusPayload });
  };

  useEffect(() => {
    console.log('user online status effect running ...');

    if (!contactStatus || !phone) return;
    setIsUserOnline(contactStatus[phone] ?? 'offline');
  }, [contactStatus, phone]);

  useEffect(() => {
    console.log('getmyChats effect running ...');

    if (!phone) return;
    dispatch(clearCurrentChat());
    getMyChats(phone);
  }, [phone]);

  useEffect(() => {
    console.log('typing effect running ...');

    setIsTyping(isUserTyping);
  }, [isUserTyping]);

  useEffect(() => {
    console.log('getUserStatus effect running ...');

    if (!wsConnectionStatus || !phone) return;
    getUserStatus();
  }, [phone, wsConnectionStatus]);

  if (!currentChatContact) {
    return (
      <div className='py-8 px-4 rounded-xl bg-secondary-bg col-span-8 flex items-center justify-center'>
        <p className='font-medium text-lg text-tertiary-text'>
          Select a contact to start chatting
        </p>
      </div>
    );
  }

  return (
    <div className='h-full overflow-y-auto  col-span-8 flex flex-col py-1 px-6 rounded-xl bg-secondary-bg gap-y-2 text-secondary-text  '>
      <div className=' flex flex-col  justify-center  py-1'>
        <div className='flex items-center gap-x-2'>
          <h2 className='text-secondary-text font-semibold text-lg'>
            {fullName}
          </h2>
          <span className='text-lg font-semibold'>| </span>
          <p className=' text-secondary-text text-sm '>+91 {phone}</p>
          {isTyping && (
            <>
              <span className=' text-lg font-semibold'>| </span>
              <p className=' text-primary font-semibold text-sm '>Typing...</p>
            </>
          )}
        </div>

        <div className='flex items-center gap-1 mt-1'>
          <span
            className={`h-2 w-2 rounded-full ${
              isUserOnline === 'online'
                ? 'bg-green-500 animate-pulse'
                : 'bg-red-500 animate-pulse'
            }`}
          ></span>
          <span className='text-sm text-gray-400'>
            {isUserOnline === 'online' ? <>&nbsp;Online</> : <>&nbsp;Offline</>}
          </span>
        </div>
      </div>

      <ChatContent userId={userId} currChats={currentChat} />

      <div className=' flex items-center border-primary-border  gap-x-1 pt-2'>
        <input
          disabled={!wsConnectionStatus}
          autoFocus
          type='text'
          value={msg}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && wsConnectionStatus) sendMsgHandler();
          }}
          onChange={onChangeHandler}
          placeholder='Type a message...'
          className='flex-1 px-3 py-2 rounded-full  bg-gray-800 text-white outline-none'
        />
        <Button
          onClick={sendMsgHandler}
          type='button'
          disabled={wsConnectionStatus}
          className={`px-8 py-2 text-lg rounded-full ${wsConnectionStatus ? 'bg-blue-900' : 'bg-gray-600'} text-white font-medium`}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
