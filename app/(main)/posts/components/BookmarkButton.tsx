'use client'

import { cn } from '@/lib/utils'
import { bookmarkInfoProps } from '@/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { HiOutlineBookmark } from 'react-icons/hi2'
import { toast } from 'sonner'

type bookmarkButtonProps = {
  postId: string
  initialState: bookmarkInfoProps
}

const BookmarkButton = ({postId, initialState}: bookmarkButtonProps) => {

  const queryClient = useQueryClient();

  const fetchPostBookmark = async () => {
    try {
      const response = await fetch('/api/bookmarkPost', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: postId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      };

      const data:bookmarkInfoProps = await response.json();
      return data;
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const bookmarkPost = async () => {
    try {
      const response = await fetch('/api/bookmarkPost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: postId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You bookmarked this post')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const unBookmarkPost = async () => {
    try {
      const response = await fetch('/api/bookmarkPost', {
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId: postId})
      })
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const queryKey = ['bookmark-post', postId]

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: fetchPostBookmark,
    initialData: initialState, 
    staleTime: Infinity
  });

  const { mutate } = useMutation({
    mutationFn: () => data.isBookmarkedByUser ? unBookmarkPost() : bookmarkPost(),
    onMutate: async () => {

      await queryClient.cancelQueries({queryKey});
      const previousState = queryClient.getQueryData<bookmarkInfoProps>(queryKey);

      queryClient.setQueryData<bookmarkInfoProps>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser
      }));

      return { previousState };
    }
  })

  return (
    <button onClick={() => mutate()}>
      <HiOutlineBookmark size={20} className={cn('', data.isBookmarkedByUser && 'fill-green-500 text-green-500')}/>
    </button>
  )
}

export default BookmarkButton