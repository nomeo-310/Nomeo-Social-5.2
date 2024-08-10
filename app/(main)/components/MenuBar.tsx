import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { HiOutlineBookmark, HiOutlineEnvelope, HiOutlineFilm, HiOutlineHome, HiOutlinePhoto } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';
import NotificationButton from '../notifications/components/NotificationButton';
import { getCurrentUser } from '@/lib/authAction';
import { connectToMongoDB } from '@/lib/connectToMongoDb';
import Notifications from '@/models/notifications';

type menuBarProps = {
  className?: string
};

type menuListProps = {
  name: string
  path: string
  icon: IconType
};

const MenuBar = async ({className}: menuBarProps) => {
  await connectToMongoDB();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  };

  const notificationCounts = await Notifications.countDocuments({recipient: currentUser._id, read: false})

  const menuList = [
    {
      name: 'Home',
      path: '/',
      icon: HiOutlineHome
    },
    {
      name: 'Bookmarks',
      path: '/bookmarks',
      icon: HiOutlineBookmark
    },
    {
      name: 'Messages',
      path: '/messages',
      icon: HiOutlineEnvelope
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
      <MenuButton 
        name={menuList[0].name} 
        path={menuList[0].path} 
        icon={menuList[0].icon}        
      />
      <NotificationButton initialState={{unreadCounts: notificationCounts}}/>
      <MenuButton 
        name={menuList[1].name} 
        path={menuList[1].path} 
        icon={menuList[1].icon}        
      />
      <MenuButton 
        name={menuList[2].name} 
        path={menuList[2].path} 
        icon={menuList[2].icon}        
      />
      <MenuButton 
        name={menuList[3].name} 
        path={menuList[3].path} 
        icon={menuList[3].icon}        
      />
      <MenuButton 
        name={menuList[4].name} 
        path={menuList[4].path} 
        icon={menuList[4].icon}        
      />
    </div>
  )
}

export default MenuBar;