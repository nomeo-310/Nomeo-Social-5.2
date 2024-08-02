'use client'

import React from 'react'
import { followUserInfoProps } from '@/types/types'
import { useFollowerInfo } from '../hooks/useFollowInfo'
import { formatNumber } from '@/lib/utils'

type followerCountProps = {
  userId: string
  initialState: followUserInfoProps
}

const FollowerCount = ({userId, initialState}: followerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  return (
    <span className='text-base lg:text-lg'>
      Followers: {" "}
      <span className='font-semibold'>{formatNumber(data.followers)}</span>
    </span>
  )
}

export default FollowerCount;