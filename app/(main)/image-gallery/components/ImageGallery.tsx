'use client'

import React from 'react'
import { mediaProps } from '@/types/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import MediaLoadingSkeleton from './MediaLoadingSkeleton'
import InfiniteScrollContainer from '@/components/common/InfiniteScrollContainer'
import ImageCard from './ImageCard'
import { Loader2 } from 'lucide-react'

export type fetchImageType = {
  images: mediaProps[]
  nextPage: number | undefined
};

const ImageGallery = () => {

  const fetchApiData = async ({pageParam}: {pageParam: number}) => {
    const response = await fetch(`/api/getImages?page=${pageParam}`);
    
    if (!response.ok) {
      throw new Error('Something went wrong, try again later');
    }

    const data = await response.json();
    return data
  };

  const {data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status} = useInfiniteQuery({
    queryKey: ['images-list'],
    queryFn: fetchApiData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const images = data?.pages.flatMap(page => page.images) || [];

  if (status === 'pending') {
    return <MediaLoadingSkeleton/>
  };

  if (status === 'success' && !images.length && !hasNextPage) {
    return  (
      <p className='text-base lg:text-lg text-center text-muted-foreground'>
        You don&apos;t have any images yet, upload some in your post.
      </p>
    )
  };

  if (status === 'error') {
    return (
      <p className='text-base lg:text-lg text-center text-destructive'>
        An error occur while loading images
      </p>
    )
  };


  return (
    <InfiniteScrollContainer className='w-full h-auto columns-2 space-y-3 mx-auto gap-3' onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
    { images && images.length > 0 && images.map((image:mediaProps) => (
      <ImageCard key={image._id} image={image} />
    ))}
    { isFetchingNextPage && <Loader2 className='mx-auto animate-spin my-3'/> }
  </InfiniteScrollContainer>
  )
}

export default ImageGallery