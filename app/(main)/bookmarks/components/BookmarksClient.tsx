'use client'

import React from 'react'
import { postProps, userProps } from '@/types/types';
import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react';
import InfiniteScrollContainer from '@/components/common/InfiniteScrollContainer';
import PostLoadingSkeleton from '../../posts/components/PostLoadingSkeleton';
import PostCard from '../../posts/components/PostCard';

export type fetchPostType = {
  posts: postProps[]
  nextPage: number | undefined
}

type postFeedProps = {
  currentUser: userProps
}


const BookmarksClient = ({currentUser}:postFeedProps) => {

  const fetchApiData = async ({pageParam}: {pageParam: number}) => {
    const response = await fetch('/api/getBookmarkFeeds', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({page: pageParam})
    });
    
    if (!response.ok) {
      throw new Error('Something went wrong, try again later');
    }

    const data = await response.json();
    return data
  };

  const {data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status} = useInfiniteQuery({
    queryKey: ['post-feed', 'bookmarks'],
    queryFn: fetchApiData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const posts = data?.pages.flatMap(page => page.posts) || [];

  if (status === 'pending') {
    return <PostLoadingSkeleton/>
  };

  if (status === 'success' && !posts.length && !hasNextPage) {
    return  (
      <p className='text-base lg:text-lg text-center text-muted-foreground'>
        You don&apos;t have any bookmarks yet
      </p>
    )
  };

  if (status === 'error') {
    return (
      <p className='text-base lg:text-lg text-center text-destructive'>
        An error occur while loading bookmarks
      </p>
    )
  };


  return (
    <InfiniteScrollContainer className='space-y-4' onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      { posts && posts.length > 0 && posts.map((post:postProps, index: number) => (
        <PostCard key={post._id} post={post} index={index} currentUser={currentUser}/>
      ))}
      { isFetchingNextPage && <Loader2 className='mx-auto animate-spin my-3'/> }
    </InfiniteScrollContainer>
  )
}

export default BookmarksClient