'use client'


import { Button } from '@/components/ui/button'
import { notificationCountProps } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { HiOutlineBell } from 'react-icons/hi2'

type notificationButtonProps = {
  initialState: notificationCountProps
}

const NotificationButton = ({initialState}: notificationButtonProps) => {

  const getUnreadNotificationCounts = async () => {
    try {
      const response = await fetch('/api/getNotifications/unread-count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      const data:notificationCountProps = await response.json();
      return data;
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const { data } = useQuery({
    queryKey: ['unread-notifications-count'],
    queryFn: getUnreadNotificationCounts,
    initialData: initialState,
    refetchInterval: 60 * 1000
  })
  return (
    <Button
      variant='ghost'
      className='flex items-center justify-start gap-3'
      title={'Notifications'}
      asChild
    >
      <Link href={'/notifications'}>
        <div className="relative">
          <HiOutlineBell size={22}/>
          { !!data.unreadCounts && 
            <span className='absolute -right-1 -top-1 bg-primary rounded-full text-primary-foreground px-1 text-xs font-medium tabular-nums'>
              {data.unreadCounts}
            </span>
          }
        </div>
        <p className='hidden lg:inline xl:text-lg text-base'>{'Notifications'}</p>
      </Link>
    </Button>
  )
}

export default NotificationButton