'use client';
import { ChatContentPropsType } from '@repo/types';
import { useEffect, useRef } from 'react';

const ChatContent = ({ currChats, userId }: ChatContentPropsType) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  let content;

  useEffect(() => {
    console.log('scrollToBottom effect running ...');

    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currChats?.length]);

  if (!currChats || currChats.length === 0) {
    content = <p className='text-center text-gray-400'>No messages yet</p>;
  } else {
    content = (
      <>
        {currChats.map((chat, idx) => {
          const isSender = chat.senderId === userId;

          return (
            <div
              key={chat.id}
              className={`  flex   ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3 py-2  rounded-2xl max-w-xs text-white ${
                  isSender ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                {chat.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </>
    );
  }

  return (
    <div className='h-full overflow-y-auto flex flex-col gap-y-2  pr-5  '>
      {content}
    </div>
  );
};

export default ChatContent;
