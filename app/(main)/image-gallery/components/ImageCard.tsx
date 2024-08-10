import React from 'react'
import Image from 'next/image'
import { mediaProps } from '@/types/types'
import Link from 'next/link'
import { formatPostDate } from '@/lib/utils'

type imageCardProps = {
  image: mediaProps
}

const ImageCard = ({image}: imageCardProps) => {
  return (
    <div className='w-full rounded-md overflow-hidden relative cursor-pointer group'>
      <Image className='size-fit object-cover' alt='image-1'width={500} height={600} src={image.url}/>
      <div className="gap-6 absolute w-full h-full bg-black/30 opacity-0 z-50 size-fit left-0 top-0 group-hover:opacity-100 transition translate-y-[100vh] group-hover:translate-y-0 duration-500 ease-in-out group-active:translate-y-0 flex flex-col items-center justify-center p-3">
        <Link href={`/posts/${image.post._id}`} className=' text-white hover:underline'>
          <p className='line-clamp-3 text-sm sm:text-base text-white'>{image.post.content}</p>
        </Link>
        <p className='text-sm sm:text-base text-white'>{formatPostDate(image.post.createdAt)}</p>
      </div>
    </div>
  )
}

export default ImageCard