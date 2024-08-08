'use client'


import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HiOutlineBell, HiOutlineBookmark, HiOutlineEnvelope, HiOutlineFilm, HiOutlineHome, HiOutlinePhoto } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

type menuBarProps = {
  className?: string
};

type menuListProps = {
  name: string
  path: string
  icon: IconType
};

const MenuBar = ({className}: menuBarProps) => {

  const menuList = [
    {
      name: 'Home',
      path: '/',
      icon: HiOutlineHome
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: HiOutlineBell
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: HiOutlineEnvelope
    },
    {
      name: 'Bookmarks',
      path: '/bookmarks',
      icon: HiOutlineBookmark
    },
    {
      name: 'Images',
      path: '/image-gallery',
      icon: HiOutlinePhoto
    },
    {
      name: 'Videos',
      path: '/video-gallery',
      icon: HiOutlineFilm
    },
  ];

  const MenuButton = ({name, path, icon:Icon}:menuListProps) => {
    return (
      <Button
      variant='ghost'
      className='flex items-center justify-start gap-3'
      title={name}
      asChild
    >
      <Link href={path}>
        <Icon size={22}/>
        <p className='hidden lg:inline xl:text-lg text-base'>{name}</p>
      </Link>
    </Button>
    )
  };

  return (
    <div className={className}>
      {menuList.map((item:menuListProps) => (
        <MenuButton key={item.name} {...item}/>
      ))}
    </div>
  )
}

export default MenuBar;