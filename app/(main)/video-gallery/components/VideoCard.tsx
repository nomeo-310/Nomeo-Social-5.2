import React from 'react'
import { mediaProps } from '@/types/types'

type imageCardProps = {
  video: mediaProps
}

const VideoCard = ({video}: imageCardProps) => {
  return (
    <div className='w-full rounded-md overflow-hidden relative cursor-pointer group'>
      <video controls className='size-fit max-h-[30rem] rounded-md'>
        <source src={video.url} type={video.type}/>
      </video>
    </div>
  )
}

export default VideoCard