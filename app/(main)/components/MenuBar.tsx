'use client'


import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HiOutlineBell, HiOutlineBookmark, HiOutlineEnvelope, HiOutlineHome } from 'react-icons/hi2';

type menuBarProps = {
  className?: string
};

const MenuBar = ({className}: menuBarProps) => {

  return (
    <div className={className}>
      <Button
        variant='ghost'
        className='flex items-center justify-start gap-3'
        title='Home'
        asChild
      >
        <Link href={'/'}>
          <HiOutlineHome size={22}/>
          <p className='hidden lg:inline xl:text-lg text-base'>Home</p>
        </Link>
      </Button>
      <Button
        variant='ghost'
        className='flex items-center justify-start gap-3'
        title='Notifications'
        asChild
      >
        <Link href={'/notifications'}>
          <HiOutlineBell size={22}/>
          <p className='hidden lg:inline xl:text-lg text-base'>Notifications</p>
        </Link>
      </Button>
      <Button
        variant='ghost'
        className='flex items-center justify-start gap-3'
        title='Messages'
        asChild
      >
        <Link href={'/messages'}>
          <HiOutlineEnvelope size={22}/>
          <p className='hidden lg:inline xl:text-lg text-base'>Messages</p>
        </Link>
      </Button>
      <Button
        variant='ghost'
        className='flex items-center justify-start gap-3'
        title='Bookmarks'
        asChild
      >
        <Link href={'/bookmarks'}>
          <HiOutlineBookmark size={22}/>
          <p className='hidden lg:inline xl:text-lg text-base'>Bookmarks</p>
        </Link>
      </Button>
    </div>
  )
}

export default MenuBar;