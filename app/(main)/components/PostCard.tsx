'use client'

import { postProps, userProps } from '@/types/types'
import Link from 'next/link'
import React from 'react'
import ImageAvatar from './ImageAvatar'
import { formatPostDate } from '@/lib/utils'
import AnimationWrapper from '@/components/common/AnimationWrapper'
import PostMenu from './PostMenu'

type postCardProps = {
  post: postProps
  index: number
  currentUser: userProps
}

const PostCard = ({post, index, currentUser}: postCardProps) => {
  return (
    <AnimationWrapper key={index} transition={{duration: 1, delay: index*0}} keyValue={`${index}`}>
      <article className='space-y-3 rounded-md bg-card p-4 shadow-sm'>
        <div className='flex justify-between gap-3'>
          <div className="flex flex-wrap gap-3">
            <Link href={`/users/${post.author.username}`}>
              <ImageAvatar imgSrc={post.author.image} className='flex-none border'/>
            </Link>
            <div>
            <Link href={`/users/${post.author.username}`} className='block font-medium hover:underline text-base'>
              {post.author.displayName}
            </Link>
            <Link href={`/posts/${post._id}`} className='block text-sm text-muted-foreground hover: underline'>
              {formatPostDate(post.createdAt)}
            </Link>
            </div>
          </div>
          <PostMenu currentUser={currentUser} post={post} className='rounded-full'/>
        </div>
        <div className='whitespace-pre-line break-words'>{post.content}</div>
      </article>
    </AnimationWrapper>
  )
}

export default PostCard