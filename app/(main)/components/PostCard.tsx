'use client'

import { postProps, userProps } from '@/types/types'
import Link from 'next/link'
import React from 'react'
import ImageAvatar from './ImageAvatar'
import { cn, formatPostDate } from '@/lib/utils'
import AnimationWrapper from '@/components/common/AnimationWrapper'
import PostMenu from './PostMenu'
import Linkify from './Linkify'
import Image from 'next/image'

type postCardProps = {
  post: postProps
  index?: number
  currentUser: userProps
};

type imageItem = {
  url: string
  _id: string
  type: string
};

const PostCard = ({post, index, currentUser}: postCardProps) => {

  const ImageGrid = ({attachments}:{attachments: imageItem[]}) => {
    return (
      <div className={cn('w-full flex flex-col gap-3', attachments.length > 1 && 'sm:grid sm:grid-cols-2 cursor-pointer items-stretch')}>
        {attachments.map(attachment => (
          <div className='relative mx-auto flex items-center justify-center' key={attachment._id}>
            { attachment.type === 'image' ? 
            (
              <Image src={attachment.url} alt='attachment_preview' width={500} height={800} className='object-cover rounded-md size-fit'/>
            ) : 
            ( <video controls className='size-fit max-h-[30rem] rounded-md'>
                <source src={attachment.url} type={attachment.type}/>
              </video>
            )}
          </div>
        ))}
      </div>
    )
  };

  return (
    <AnimationWrapper key={index} transition={{duration: 1, delay: index && index*0}} keyValue={`${index}`}>
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
            <Link href={`/posts/${post._id}`} className='block text-sm text-muted-foreground hover: underline' suppressHydrationWarning>
              {formatPostDate(post.createdAt)} {" . "} {post.author.city && post.author.state && <span>{post.author.city}, {post.author.state}.</span>}
            </Link>
            </div>
          </div>
          <PostMenu currentUser={currentUser} post={post} className='rounded-full'/>
        </div>
        { post.attachments.length > 0 && <ImageGrid attachments={post.attachments}/>}
        <Linkify>
          <div className='whitespace-pre-line break-words'>{post.content}</div>
        </Linkify>
      </article>
    </AnimationWrapper>
  )
}

export default PostCard