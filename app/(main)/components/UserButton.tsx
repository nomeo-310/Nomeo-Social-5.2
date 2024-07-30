'use client'

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from '@/components/ui/dropdown-menu'
import { userProps } from '@/types/types'
import React from 'react'
import ImageAvatar from './ImageAvatar'
import Link from 'next/link'
import { HiCheck, HiOutlineMoon, HiOutlinePower, HiOutlineSun, HiOutlineTv, HiOutlineUser } from 'react-icons/hi2'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { useQueryClient } from '@tanstack/react-query'

type Props = {
  className?: string
  currentUser: userProps
}

const UserButton = ({className, currentUser}: Props) => {

  const { theme, setTheme} = useTheme();

  const queryClient = useQueryClient()

  const logOut = () => {
    queryClient.clear();
    signOut();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='focus:outline-none'>
        <button type='button' className={cn('flex-none', className)}>
          <ImageAvatar imgSrc={currentUser.image}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='cursor-pointer'>
        <DropdownMenuLabel>
          <p className='lg:text-lg text-base'>@{currentUser.username}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <Link href={`/profile/${currentUser.username}`}>
          <DropdownMenuItem>
            <HiOutlineUser size={20} className='mr-2'/>
            <p className='text-base'>Profile</p>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <HiOutlineTv size={20} className='mr-2'/>
            <p className='text-base'>Theme</p>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <HiOutlineTv size={20} className='mr-2'/>
                <p className='text-base'>System</p>
                {theme === 'system' && <HiCheck size={18} className='ml-2'/>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <HiOutlineSun size={20} className='mr-2'/>
                <p className='text-base'>Light</p>
                {theme === 'light' && <HiCheck size={18} className='ml-2'/>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <HiOutlineMoon size={20} className='mr-2'/>
                <p className='text-base'>Dark</p>
                {theme === 'dark' && <HiCheck size={18} className='ml-2'/>}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={logOut}>
            <HiOutlinePower size={20} className='mr-2'/>
            <p className='text-base'>Log Out</p>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton;