'use client'

import React from 'react'
import { postProps, userProps } from '@/types/types';
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react';
import PostCard from './PostCard';
import InfiniteScrollContainer from '@/components/common/InfiniteScrollContainer';
import PostLoadingSkeleton from './PostLoadingSkeleton';

export type fetchPostType = {
  posts: postProps[]
  nextPage: number | undefined
}

type postFeedProps = {
  currentUser: userProps
}


const PostFeeds = ({ currentUser }:postFeedProps) => {

  const fetchApiData = async ({ pageParam }: { pageParam: number }) => {
    const response = await fetch('/api/getFeeds', {
      method: 'POST',
      body: JSON.stringify({ page: pageParam }),
      headers: { 'Content-Type': 'application/json', },
    });
    
    if (!response.ok) {
      throw new Error(`Something went wrong, try again later ${response.status}`);
    }

    const data = await response.json();
    return data
  };

  const {data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status, error } = useInfiniteQuery({
    queryKey: ['post-feed', 'all-posts'],
    queryFn: fetchApiData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const posts:postProps[] = data?.pages.flatMap(page => page.posts) || [];

  if (status === 'pending') {
    return <PostLoadingSkeleton/>
  }

  if (status === 'success' && !posts.length && !hasNextPage) {
    return  (
      <p className='text-base lg:text-lg text-center text-muted-foreground'>
        No one has posted anything yet
      </p>
    )
  }

  if (status === 'error') {
    return (
      <p className='text-base lg:text-lg text-center text-destructive'>
        An error occur while loading posts.
      </p>
    )
  }


  return (
    <InfiniteScrollContainer className='space-y-4' onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      { posts && posts.length > 0 && posts.map((post:postProps, index: number) => (
        <PostCard key={post._id} post={post} index={index} currentUser={currentUser}/>
      ))}
      { isFetchingNextPage && <Loader2 className='mx-auto animate-spin my-3'/> }
    </InfiniteScrollContainer>
  )
}

export default PostFeeds