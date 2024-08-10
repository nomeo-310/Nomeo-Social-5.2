import React from 'react'
import { Channel, ChannelHeader, MessageInput, MessageList, Window } from 'stream-chat-react';

type Props = {}

const ChatChannel = (props: Props) => {
  return (
    <Channel>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
    </Channel>
  )
}

export default ChatChannel;