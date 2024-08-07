'use client'

import React from 'react'
import { likeUserInfoProps } from '@/types/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { HiOutlineHeart } from 'react-icons/hi2';
import { cn } from '@/lib/utils';

type likeButtonProps = {
  postId: string
  initialState: likeUserInfoProps
};

const LikeButton = ({postId, initialState}: likeButtonProps) => {

  const queryClient = useQueryClient();

  const fetchPostLikes = async () => {
    try {
      const response = await fetch('/api/likePost', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      };

      const data:likeUserInfoProps = await response.json();
      return data;
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const unLikePost = async () => {
    try {
      const response = await fetch('/api/likePost', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You no longer like this post')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const likePost = async () => {
    try {
      const response = await fetch('/api/likePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: postId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You like this post')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const queryKey = ['like-post', postId]

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: fetchPostLikes,
    initialData: initialState,
    staleTime: Infinity
  });

  const { mutate } = useMutation({
    mutationFn: () => data.isLikedByUser ? unLikePost() : likePost(),
    onMutate: async () => {

      await queryClient.cancelQueries({queryKey});
      const previousState = queryClient.getQueryData<likeUserInfoProps>(queryKey);

      queryClient.setQueryData<likeUserInfoProps>(queryKey, () => ({
        likes: (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser
      }));

      return { previousState };
    }
  });

  return (
    <button onClick={() => mutate()} className='flex items-center gap-2'>
      <HiOutlineHeart  size={20} className={cn('', data.isLikedByUser && 'fill-red-500 text-red-500' )}/>
      { data.likes > 0 &&
        <span className='text-sm font-medium tabular-nums'>
          {data.likes} <span className='hidden sm:inline'>{data.likes > 1 ? 'likes': 'like'}</span>
        </span>
      }
    </button>
  )
}

export default LikeButton