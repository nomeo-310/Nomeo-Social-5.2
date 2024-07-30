'use client'

import { postProps } from '@/types/types'
import Link from 'next/link'
import React from 'react'
import ImageAvatar from './ImageAvatar'
import { formatPostDate } from '@/lib/utils'

type postCardProps = {
  post: postProps
}

const PostCard = ({post}: postCardProps) => {
  return (
    <article className='space-y-3 rounded-md bg-card p-4 shadow-sm'>
      <div className="flex flex-wrap gap-3">
        <Link href={`/profile/${post.author.username}`}>
          <ImageAvatar imgSrc={post.author.image} className='flex-none border'/>
        </Link>
        <div>
        <Link href={`/profile/${post.author.username}`} className='block font-medium hover:underline text-base'>
          {post.author.displayName}
        </Link>
        <Link href={`/posts/${post._id}`} className='block text-sm text-muted-foreground hover: underline'>
          {formatPostDate(post.createdAt)}
        </Link>
        </div>
      </div>
      <div className='whitespace-pre-line break-words'>{post.content}</div>
    </article>
  )
}

export default PostCard