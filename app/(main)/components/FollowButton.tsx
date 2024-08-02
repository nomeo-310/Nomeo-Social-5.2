'use client'

import { followUserInfoProps } from '@/types/types'
import React from 'react'
import { useFollowerInfo } from '../hooks/useFollowInfo'
import { QueryFilters, QueryKey, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

type followButtonProps = {
  userId: string
  initialState: followUserInfoProps
}

const FollowButton = ({userId, initialState}: followButtonProps) => {
  const queryClient = useQueryClient();

  const { data } = useFollowerInfo(userId, initialState);

  const queryKey: QueryKey = ['follower-info', userId]

  const unFollowUser = async () => {
    try {
      const response = await fetch('/api/followUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You are no longer following user')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const followUser = async () => {
    try {
      const response = await fetch('/api/followUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You are now following user')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const { mutate } = useMutation({
    mutationFn: () => data.isFollowedBy ? unFollowUser() : followUser(),
    onMutate: async () => {

      await queryClient.cancelQueries({queryKey});
      const previousState = queryClient.getQueryData<followUserInfoProps>(queryKey);

      queryClient.setQueryData<followUserInfoProps>(queryKey, () => ({
        followers: (previousState?.followers || 0) + (previousState?.isFollowedBy ? -1 : 1),
        isFollowedBy: !previousState?.isFollowedBy
      }));

      return { previousState };
    },
    onError(error, variables, context) {
      queryClient.setQueryData<followUserInfoProps>(queryKey, context?.previousState)
      console.error(error)

      toast.error('Something went wrong. Please try again');
    }
  })

  return (
    <Button variant={data.isFollowedBy ? 'secondary' : 'default'} onClick={() => mutate()} className='rounded-full'>
      <p className='text-base'>{data.isFollowedBy ? 'Unfollow' : 'Follow'}</p>
    </Button>
  )
}

export default FollowButton