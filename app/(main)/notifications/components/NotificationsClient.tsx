'use client'


import React from 'react'
import { notificationProps, userProps } from '@/types/types'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import NotificationLoadingSkeleton from './NotificationLoadingSkeleton'
import InfiniteScrollContainer from '@/components/common/InfiniteScrollContainer'
import { Loader2 } from 'lucide-react'
import NotificationCard from './NotificationCard'

type notificationClientProps = {
  currentUser: userProps
}

const NotificationsClient = ({currentUser}: notificationClientProps) => {

  const getNotifications = async ({pageParam}: {pageParam: number}) => {
    const response = await fetch(`/api/getNotifications?page=${pageParam}`);
    
    if (!response.ok) {
      throw new Error('Something went wrong, try again later');
    }

    const data = await response.json();
    return data
  };

  const readNotification = async () => {
    try {
      const response = await fetch('/api/getNotifications/mark-as-read', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const {data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status} = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage
  });

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.setQueryData(['unread-notification-count'], { unreadCounts: 0 })
    },
    onError(error) {
      console.error('Failed to mark notifications as read', error)
    }
  });

  React.useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications:notificationProps[] = data?.pages.flatMap(page => page.notifications) || [];

  if (status === 'pending') {
    return <NotificationLoadingSkeleton/>
  };

  if (status === 'success' && !notifications.length && !hasNextPage) {
    return  (
      <p className='text-base lg:text-lg text-center text-muted-foreground'>
        You don&apos;t have any notifications yet
      </p>
    )
  };

  if (status === 'error') {
    return (
      <p className='text-base lg:text-lg text-center text-destructive'>
        An error occur while loading notifications
      </p>
    )
  };

  return (
    <InfiniteScrollContainer className='space-y-4' onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}>
      { notifications && notifications.length > 0 && notifications.map((notification:notificationProps, index: number) => (
        <NotificationCard key={notification._id} notification={notification} index={index} currentUser={currentUser}/>
      ))}
      { isFetchingNextPage && <Loader2 className='mx-auto animate-spin my-3'/> }
    </InfiniteScrollContainer>
  )
}

export default NotificationsClient