'use client'

import React from 'react'
import { useInitializeChatClient } from '../../hooks/useInitializeChatClient'
import { Loader2 } from 'lucide-react';
import { Chat as StreamChat } from 'stream-chat-react'
import ChatSidebar from './ChatSidebar';
import { userProps } from '@/types/types';
import ChatChannel from './ChatChannel';


const Chat = ({currentUser}:{currentUser: userProps}) => {

  const chatClient = useInitializeChatClient();

  if (!chatClient) {
    return <Loader2 className='mx-auto animate-spin my-3'/>
  };


  return (
    <main className='relative w-full rounded-md overflow-hidden bg-card shadow-sm'>
      <div className='absolute top-0 bottom-0 flex w-full'>
        <StreamChat client={chatClient}>
          <ChatSidebar currentUser={currentUser}/>
          <ChatChannel/>
        </StreamChat>
      </div>
    </main>
  )
}

export default Chat