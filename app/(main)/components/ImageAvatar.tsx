'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type imageAvatarProps = {
  imgSrc: string | null | undefined
  className?: string
}

const ImageAvatar = ({imgSrc, className}: imageAvatarProps) => {
  return (
    <div className={cn('overflow-hidden rounded-full aspect-square size-8 md:size-9 bg-secondary relative', className)}>
      <Image src={imgSrc ? imgSrc : '/images/user-avatar.png'} alt='profile-avatar' fill priority className='object-cover'/>
    </div>
  )
}

export default ImageAvatar
