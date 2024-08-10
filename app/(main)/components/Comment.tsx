import { commentProps, userProps } from '@/types/types'
import Link from 'next/link'
import React from 'react'
import ImageAvatar from './ImageAvatar'
import { formatPostDate } from '@/lib/utils'
import CommentMenu from './CommentMenu'

type singleCommentProps = {
  comment: commentProps
  currentUser: userProps
}

const Comment = ({comment, currentUser}: singleCommentProps) => {
  return (
    <div className='flex gap-3 py-3 relative'>
      <span className="hidden sm:inline">
        <Link href={`/users/${comment.author.username}`}>
          <ImageAvatar imgSrc={comment.author.image}/>
        </Link>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <Link href={`/users/${comment.author.username}`} className='font-medium hover:text-underline'>
            {comment.author.displayName}
          </Link>
          <span className="text-muted-foreground">
            {formatPostDate(comment.createdAt)}
          </span>
        </div>
        <div>
          {comment.content}
        </div>
      </div>
      {comment.author._id === currentUser._id && 
        <CommentMenu comment={comment} className='absolute right-3 top-0 rounded-full'/>
      }
    </div>
  )
}

export default Comment