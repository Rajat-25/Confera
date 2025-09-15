import { ChatContentPropsType } from '@repo/types';

const ChatContent = ({ currChats, userId }: ChatContentPropsType) => {
  let content;
  if (!currChats || currChats.length === 0) {
    content = <p className='text-center text-gray-400'>No messages yet</p>;
  } else {
    content = (
      <>
        {currChats?.map((chat) => {
          const isSender = chat.senderId === userId;

          return (
            <div
              key={chat.id}
              className={`flex   ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-1  rounded-xl max-w-xs text-white ${
                  isSender ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                {chat.text}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  return (
    <div className='flex-1 h-full overflow-y-auto py-4 flex flex-col gap-y-2'>
      {content}
    </div>
  );
};

export default ChatContent;
