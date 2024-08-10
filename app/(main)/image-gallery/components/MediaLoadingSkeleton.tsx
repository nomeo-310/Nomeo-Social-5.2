import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

type Props = {}

const MediaLoadingSkeleton = (props: Props) => {

  const LoadingSkeleton = () => {
    return (
      <div className="w-full aspect-square animate-pulse space-y-3 rounded-md bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <Skeleton className='md:h-32 lg:h-48 h-28 rounded-md'/>
          <div className="space-y-2">
            <Skeleton className='h-4 w-24 rounded'/>
            <Skeleton className='h-4 w-20 rounded'/>
          </div>
        </div>
      </div>
    )
  };
  return (
    <div className='grid grid-cols-2 gap-3'>
      <LoadingSkeleton/>
      <LoadingSkeleton/>
      <LoadingSkeleton/>
      <LoadingSkeleton/>
    </div>
  )
}

export default MediaLoadingSkeleton