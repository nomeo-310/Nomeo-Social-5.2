'use client'

import React from 'react'
import { mediaProps } from '@/types/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScrollContainer from '@/components/common/InfiniteScrollContainer'
import { Loader2 } from 'lucide-react'
import MediaLoadingSkeleton from '../../image-gallery/components/MediaLoadingSkeleton'
import VideoCard from './VideoCard'

export type fetchImageType = {
  images: mediaProps[]
  nextPage: number | undefined
};

const VideoGallery = () => {

  const fetchApiData = async ({pageParam}: {pageParam: number}) => {
    const response = await fetch(`/api/getVideos?page=${pageParam}`);
    
    if (!response.ok) {
      throw new Error('Something went wrong, try again later');
    }

    const data = await response.json();
    return data
  };

  const {data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status} = useInfiniteQuery({
    queryKey: ['video-list'],
    queryFn: fetchApiData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const videos = data?.pages.flatMap(page => page.videos) || [];

  if (status === 'pending') {
    return <MediaLoadingSkeleton/>
  };

  if (status === 'success' && !videos.length && !hasNextPage) {
    return  (
      <p className='text-base lg:text-lg text-center text-muted-foreground'>
        You don&apos;t have any videos yet, upload some in your post.
      </p>
    )
  };

  if (status === 'error') {
    return (
      <p className='text-base lg:text-lg text-center text-destructive'>
        An error occur while loading videos
      </p>
    )
  };


  return (
    <InfiniteScrollContainer className='w-full h-auto columns-2 space-y-3 mx-auto gap-3' onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
    { videos && videos.length > 0 && videos.map((video:mediaProps) => (
      <VideoCard key={video._id} video={video} />
    ))}
    { isFetchingNextPage && <Loader2 className='mx-auto animate-spin my-3'/> }
  </InfiniteScrollContainer>
  )
}

export default VideoGallery