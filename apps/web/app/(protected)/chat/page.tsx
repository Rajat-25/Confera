import { GetAllMappedConversation, GetUserChat } from '@/app/actions/chat';
import { GetAllMappedContacts } from '@/app/actions/contact';
import { auth } from '@/auth';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';

const page = async () => {
  const session = await auth();
  const userId = session?.user.id!;

  const { success: conversationSuccess, data: dbMappedConversations } =
    await GetAllMappedConversation();
  const { success: contactSuccess, data: dbMappedContacts } =
    await GetAllMappedContacts();

  return (
    <div className='h-full p-6'>
      <div className=' h-full rounded-xl gap-x-2 grid grid-cols-12'>
        <ChatList
          userId={userId}
          dbMappedContacts={dbMappedContacts}
          dbMappedConversations={dbMappedConversations}
        />
        <ChatWindow userId={userId} GetUserChat={GetUserChat} />
      </div>
    </div>
  );
};

export default page;
