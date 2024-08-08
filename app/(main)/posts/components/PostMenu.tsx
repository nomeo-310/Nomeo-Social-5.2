'use client'

import React from 'react'
import { notificationStatusProps, postProps, userProps, visibilityStatusProps } from '@/types/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { HiEllipsisHorizontal, HiOutlineBellAlert, HiOutlineBellSlash, HiOutlineExclamationTriangle, HiOutlineTrash, HiSignal, HiSignalSlash} from 'react-icons/hi2'
import DeletePostDialog from './DeletePostDialog'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type postMenuProps = {
  post: postProps
  currentUser: userProps
  className?: string
};

const PostMenu = ({post, currentUser, className}: postMenuProps) => {
  const isAuthor = post.author._id === currentUser._id;

  const [showDeletePostDialog, setShowDeletePostDialog] = React.useState(false);

  const queryClient = useQueryClient();

  const fetchNotificationStatus = async () => {
    try {
      const response = await fetch('/api/setPostNotification', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: post._id})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      };

      const data:notificationStatusProps = await response.json();
      return data
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const fetchVisibilityStatus = async () => {
    try {
      const response = await fetch('/api/setPostVisibility', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: post._id})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      };

      const data:visibilityStatusProps = await response.json();
      return data
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const hideNotification = async () => {
    try {
      const response = await fetch('/api/setPostNotification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: post._id})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You have turned off notification for this post')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const hidePost = async () => {
    try {
      const response = await fetch('/api/setPostVisibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: post._id})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You have hidden this post from public view')
      window.location.reload();
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const showNotification = async () => {
    try {
      const response = await fetch('/api/setPostNotification', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: post._id})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You have turned on notification for this post')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const showPost= async () => {
    try {
      const response = await fetch('/api/setPostVisibility', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({postId: post._id})
      });

      if (!response.ok) {
        throw new Error('Something went wrong, try again later');
      }

      toast.success('You have returned this post to the public view')
    } catch (error) {
      console.error(error)
      throw new Error('Internal server error, try again later');
    }
  };

  const notificationQueryKey = ['set-post-notification', post._id]
  const visibilityQueryKey = ['set-post-visibility', post._id]

  const notificationQuery = useQuery({
    queryKey: notificationQueryKey,
    queryFn: fetchNotificationStatus,
    initialData: {notificationStatus: post.hideNotification},
    staleTime: Infinity
  });

  const visibilityQuery = useQuery({
    queryKey: visibilityQueryKey,
    queryFn: fetchVisibilityStatus,
    initialData: {visibilityStatus: post.hidePost},
    staleTime: Infinity
  });

  const mutateNoficationStatus = useMutation({
    mutationFn: () => notificationQuery.data.notificationStatus === true ? showNotification() : hideNotification(),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: notificationQueryKey});
      const previousState = queryClient.getQueryData<notificationStatusProps>(notificationQueryKey);

      queryClient.setQueryData<notificationStatusProps>(notificationQueryKey, () => ({
        notificationStatus: !previousState?.notificationStatus
      }));

      return { previousState }
    }
  });

  const mutateVisibilityStatus = useMutation({
    mutationFn: () => visibilityQuery.data.visibilityStatus === true ? showPost() : hidePost(),
    onMutate: async () => {
      await queryClient.cancelQueries({queryKey: visibilityQueryKey});
      const previousState = queryClient.getQueryData<visibilityStatusProps>(visibilityQueryKey);

      queryClient.setQueryData<visibilityStatusProps>(visibilityQueryKey, () => ({
        visibilityStatus: !previousState?.visibilityStatus
      }));

      return { previousState }
    }
  });

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='focus:outline-none active:outline-none'>
          <Button size={'icon'} variant={'ghost'} className={className}>
            <HiEllipsisHorizontal size={22} className='text-muted-foreground hidden sm:block'/>
            <HiEllipsisHorizontal size={20} className='text-muted-foreground sm:hidden'/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          { isAuthor &&
            <DropdownMenuItem className='cursor-pointer' onClick={() => setShowDeletePostDialog(true)}>
              <div className="flex items-center gap-3">
                <HiOutlineTrash size={22} className='text-destructive hidden sm:block'/>
                <HiOutlineTrash size={18} className='text-destructive sm:hidden'/>
                <p className='text-sm sm:text-base'>Delete post</p>
              </div>
            </DropdownMenuItem>
          }
          { isAuthor &&
            <DropdownMenuItem className='cursor-pointer' onClick={() => mutateNoficationStatus.mutate()}>
              <div className="flex items-center gap-3">
                { notificationQuery.data.notificationStatus ? <HiOutlineBellAlert size={22} className='text-green-500 hidden sm:block'/> : <HiOutlineBellSlash size={22} className='text-destructive hidden sm:block'/>}
                { notificationQuery.data.notificationStatus ? <HiOutlineBellAlert size={18} className='text-green-500 hidden sm:hidden'/> : <HiOutlineBellSlash size={18} className='text-destructive sm:hidden'/>}
                <p className='text-sm sm:text-base'>{ notificationQuery.data.notificationStatus ? 'On notitification' : 'Off notitification' }</p>
              </div>
            </DropdownMenuItem>
          }
          { !isAuthor &&
            <DropdownMenuItem className='cursor-pointer'>
              <div className="flex items-center gap-3">
                <HiOutlineExclamationTriangle size={22} className='text-destructive hidden sm:block'/>
                <HiOutlineExclamationTriangle size={18} className='text-destructive sm:hidden'/>
                <p className='text-sm sm:text-base'>Report post</p>
              </div>
            </DropdownMenuItem>
          }
          { isAuthor &&
            <DropdownMenuItem className='cursor-pointer' onClick={() => mutateVisibilityStatus.mutate()}>
              <div className="flex items-center gap-3">
                { visibilityQuery.data.visibilityStatus ? <HiSignal size={22} className='text-green-500 hidden sm:block'/> : <HiSignalSlash size={22} className='text-destructive hidden sm:block'/>}
                { visibilityQuery.data.visibilityStatus ? <HiSignal size={18} className='text-green-500 sm:hidden'/> : <HiSignalSlash size={18} className='text-destructive sm:hidden'/>}
                <p className='text-sm sm:text-base'>{ visibilityQuery.data.visibilityStatus ? 'Unhide post' : 'Hide post' }</p>
              </div>
            </DropdownMenuItem>
          }
        </DropdownMenuContent>
      </DropdownMenu>
      { showDeletePostDialog && 
        <DeletePostDialog
          open={showDeletePostDialog}
          onClose={() => setShowDeletePostDialog(false)}
          post={post}
        />
      }
    </React.Fragment>
  )
}

export default PostMenu