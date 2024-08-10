'use client'

import React from 'react'
import { commentProps, postProps, userProps } from '@/types/types'
import CommentInput from './CommentInput'
import { useInfiniteQuery } from '@tanstack/react-query'
import Comment from './Comment'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type commentSectionProps = {
  currentUser: userProps
  post: postProps
}

export type fetchCommentType = {
  comments: commentProps[]
  previousPage: number | undefined
};

const CommentSection = ({currentUser, post}: commentSectionProps) => {
  const fetchApiData = async ({pageParam}: {pageParam: number}) => {
    const response = await fetch(`/api/getComments/${post._id}?page=${pageParam}`);
    
    if (!response.ok) {
      throw new Error('Something went wrong, try again later');
    }

    const data = await response.json();
    return data
  };

  const { data, hasNextPage, status, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ['comments', post._id],
    queryFn: fetchApiData,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.previousPage,
  });

  const comments = data?.pages.flatMap(page => page.comments) || []

  return (
    <div className='space-y-3'>
      <CommentInput post={post} currentUser={currentUser}/>
        {hasNextPage && (
          <Button variant={'link'} className='mx-auto block text-base' disabled={isFetching} onClick={() => fetchNextPage()}>
            Load previous comments
          </Button>)
        }
        { status === 'pending' && (
          <Loader2 className='animate-spin' />) 
        }
        { status === 'success' && !comments.length && (
          <p className='text-muted-foreground text-center'>No comments yet</p>)
        }
        { status === 'error' &&  (
          <p className='text-destructive text-center'>An error occur while loading comment</p>)
        }
      <div className="divide-y">
        { comments.map((comment) => (
          <Comment comment={comment} key={comment._id} currentUser={currentUser}/>
        ))}
      </div>
    </div>
  )
}

export default CommentSection