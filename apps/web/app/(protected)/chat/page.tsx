import {
  GetAllConversations,
  GetAllConversationsId,
  GetUserChat,
} from '@/app/actions/chat';
import { auth } from '@/auth';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';

const page = async () => {
  const session = await auth();
  const userPhone = session?.user.phone!;
  const userId = session?.user.id!;

  const { data: conversationMapDB = {} } = await GetAllConversationsId();
  const { data: conversations } = await GetAllConversations();

  return (
    <div className='h-full p-6'>
      <div className=' h-full rounded-xl gap-x-2 grid grid-cols-12'>
        <ChatList
          userId={userId}
          userPhone={userPhone}
          conversations={conversations}
        />
        <ChatWindow
          conversationMapDB={conversationMapDB}
          userId={userId}
          GetUserChat={GetUserChat}
        />
      </div>
    </div>
  );
};

export default page;
