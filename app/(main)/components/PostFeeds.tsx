'use client'

import React from 'react'
import { postProps } from '@/types/types';
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';


const PostFeeds = () => {
  const query  = useQuery<postProps[]>({
    queryKey: ['post-feeds', 'all-posts'],
    queryFn: async () => {
      const response = await fetch('/api/getFeeds');
      if (!response.ok) {
        throw Error(`Request failed with status code ${response.status}`)
      }
      return response.json();
    }
  });

  if (query.status === 'pending') {
    return <Loader2 className='mx-auto animate-spin'/>
  }

  if (query.status === 'error') {
    return (
      <p className='text-base lg:text-lg text-center text-destructive'>
        An error occur while loading posts
      </p>
    )
  }


  return (
    <React.Fragment>
      { query.data.map((post:postProps) => (
        <PostCard key={post._id} post={post}/>
      )) }
    </React.Fragment>
  )
}

export default PostFeeds