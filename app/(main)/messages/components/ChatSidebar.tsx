'use client'

import React from 'react'
import { userProps } from '@/types/types'
import { ChannelList } from 'stream-chat-react'

type chatSideBarProps = {
  currentUser: userProps
}

const ChatSidebar = ({currentUser}: chatSideBarProps) => {
  
  return (
    <div className='size-full flex flex-col border-e md:w-72'>
      <ChannelList
         
      />
    </div>
  )
}

export default ChatSidebar