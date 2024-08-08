import { commentProps } from '@/types/types'
import Link from 'next/link'
import React from 'react'
import ImageAvatar from './ImageAvatar'
import { formatPostDate } from '@/lib/utils'

type singleCommentProps = {
  comment: commentProps
}

const Comment = ({comment}: singleCommentProps) => {
  return (
    <div className='flex gap-3 py-3'>
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
    </div>
  )
}

export default Comment