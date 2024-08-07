import React from 'react'
import { Skeleton } from '@/components/ui/skeleton';


const PostLoadingSkeleton = () => {

  const LoadingSkeleton = () => {
    return (
      <div className="w-full animate-pulse space-y-3 rounded-md bg-card p-4 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <Skeleton className='size-12 rounded-full'/>
          <div className="space-y-1.5">
            <Skeleton className='h-4 w-24 rounded'/>
            <Skeleton className='h-4 w-20 rounded'/>
          </div>
        </div>
        <Skeleton className='h-16 rounded-md'/>
      </div>
    )
  };

  return (
    <div className='space-y-4'>
      <LoadingSkeleton/>
      <LoadingSkeleton/>
      <LoadingSkeleton/>
    </div>
  )
}

export default PostLoadingSkeleton