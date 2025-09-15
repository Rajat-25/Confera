'use client';
import {
  clearChatState,
  clearCurrentChat,
  RootState,
  setConversationMap,
  setCurrentChat,
} from '@/store';
import { WS_CONST } from '@repo/lib';
import { ChatWindowProps, SendMsgPayloadType } from '@repo/types';
import { Button } from '@repo/ui/button';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatContent from './ChatContent';

const ChatWindow = ({
  GetUserChat,
  conversationMapDB,
  userId,
}: ChatWindowProps) => {
  const { currentChatContact, conversationMap, currentChat } = useSelector(
    (state: RootState) => {
      return state.chat_slice;
    }
  );

  const { wsConnectionStatus } = useSelector((state: RootState) => {
    return state.websocket_Slice;
  });

  const { contactStatus } = useSelector((state: RootState) => {
    return state.contact_slice;
  });

  const [msg, setMsg] = useState<string>('');
  const dispatch = useDispatch();
  const { CHAT, USER_STATUS } = WS_CONST;

  if (!currentChatContact) {
    return (
      <div className='py-8 px-4 rounded-xl bg-secondary-bg text-secondary-text col-span-8 flex items-center justify-center'>
        <p className='text-gray-400'>Select a contact to start chatting</p>
      </div>
    );
  }

  const { fullName, phone } = currentChatContact;

  const isUserOnline = contactStatus[phone];


  useEffect(() => {
    dispatch(setConversationMap(conversationMapDB));
  }, [conversationMapDB]);

  useEffect(() => {
    dispatch(clearCurrentChat());
    if (!phone) return;
    const callFunc = async () => {
      const { success, chats } = await GetUserChat(phone);
      if (success && chats) {
        dispatch(setCurrentChat(chats));
      }
    };

    callFunc();

    return () => {
      clearChatState();
    };
  }, [phone]);

  useEffect(() => {
    if (!wsConnectionStatus || !phone) return;

    const userStatusPayload = { type: USER_STATUS, payload: { phone } };
    dispatch(userStatusPayload);
  }, [phone, wsConnectionStatus]);

  const sendMsgHandler = () => {
    const conversationId = conversationMap?.[phone];

    if (!msg && !wsConnectionStatus) return;

    const payload: SendMsgPayloadType = {
      receiverPhone: phone,
      conversationId,
      text: msg,
    };

    dispatch({ type: CHAT, payload });

    setMsg('');
  };

  return (
    <div className='py-2 px-8 rounded-xl bg-secondary-bg text-secondary-text col-span-8 flex flex-col '>
      <div className='flex flex-col  justify-center  border-primary-border border-b-2 pb-2'>
        <div className='flex items-center gap-x-2'>
          <h2 className='text-secondary-text font-semibold text-lg'>
            {fullName}
          </h2>
          <span className='text-lg font-semibold'>| </span>
          <p className=' text-secondary-text text-sm '>+91 {phone}</p>
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
            {isUserOnline ? <>&nbsp;Online</> : <>&nbsp;Offline</>}
          </span>
        </div>
      </div>

      <ChatContent userId={userId} currChats={currentChat} />

      <div className='flex items-center gap-2 border-primary-border border-t-2 pt-2'>
        <input
          disabled={!wsConnectionStatus}
          autoFocus
          type='text'
          value={msg}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && wsConnectionStatus) sendMsgHandler();
          }}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
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
