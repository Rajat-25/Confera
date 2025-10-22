'use client';
import { clearCurrentChat, RootState, setCurrentChat } from '@/store';
import { CHAT_CONST } from '@repo/lib';
import { ChatWindowProps, SendMsgPayloadType, StatusType } from '@repo/types';
import { Button } from '@repo/ui/button';

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
    setMsg(e.target.value);

    if (!phone) return;

    if (typingRef.current) clearTimeout(typingRef.current);

    typingRef.current = setTimeout(() => {
      dispatch({
        type: TYPING,
        payload: { phone },
      });
    }, 200);
  };

  const getMyChats = async (phone: string) => {
    const { success, chats } = await GetUserChat(phone);
    if (success && chats && chats.length !== 0) {
      dispatch(setCurrentChat(chats));
    }
  };

  useEffect(() => {
    if (!contactStatus || !phone) return;
    setIsUserOnline(contactStatus[phone] ?? 'offline');
  }, [contactStatus, phone]);

  useEffect(() => {
    dispatch(clearCurrentChat());

    if (!phone) return;
    
    getMyChats(phone);
  }, [phone]);

  useEffect(() => {
    setIsTyping(isUserTyping);
  }, [isUserTyping]);

  useEffect(() => {
    if (!wsConnectionStatus || !phone) return;
    const userStatusPayload = { type: USER_STATUS, payload: { phone } };
    dispatch(userStatusPayload);
  }, [phone, wsConnectionStatus]);

  if (!currentChatContact) {
    return (
      <div className='py-8 px-4 rounded-xl bg-secondary-bg text-secondary-text col-span-8 flex items-center justify-center'>
        <p className='text-gray-400'>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className='h-full py-2 px-8 rounded-xl bg-secondary-bg text-secondary-text col-span-8 flex flex-col '>
      <div className='flex flex-col  justify-center  border-primary-border border-b-2 pb-2'>
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

      <div className='flex items-center  border-primary-border border-t pt-2'>
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
          className='flex-1 px-3 py-2 rounded-2xl  bg-gray-800 text-white outline-none'
        />
        <Button
          onClick={sendMsgHandler}
          type='button'
          disabled={wsConnectionStatus}
          className={`px-8 py-2 text-lg rounded-full ${wsConnectionStatus ? 'bg-blue-800' : 'bg-gray-600'} text-white font-medium`}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
