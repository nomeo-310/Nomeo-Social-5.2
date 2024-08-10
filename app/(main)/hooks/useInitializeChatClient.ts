'use client'

import React from "react";
import { useSession } from "next-auth/react"
import { StreamChat } from "stream-chat";

export const useInitializeChatClient = () => {
  const session = useSession();


  const [chatClient, setChatClient] = React.useState<StreamChat | null>(null);

  const user:any = session && session.data?.user;

  const { _id, username, image, name }:{_id: string, username: string, image: string, name: string} = user;

  React.useEffect(() => {

    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!)

    client.connectUser(
      {
        id: _id,
        username: username,
        name: name,
        image: image
      },
      async () => {
        const response = await fetch('/api/get-token')

        if (!response.ok) {
          throw new Error('Something went wrong, try again later');
        };

        const { token } = await response.json();

        return token
      }
    )
  .catch((error) => console.error('Failed to connect user', error))
  .then(() => setChatClient(client))

    return () => {
      setChatClient(null);
      client
      .disconnectUser()
      .catch((error) => console.error('Failed to disconnect user', error))
      .then(() => console.log('Connection closed'))
    };
  }, [_id, image, name, username]);

  return chatClient;
}