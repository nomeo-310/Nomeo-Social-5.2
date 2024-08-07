'use client'


import React from 'react'
import { postProps, userProps } from '@/types/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { HiEllipsisHorizontal, HiOutlineBellAlert, HiOutlineBellSlash, HiOutlineExclamationTriangle, HiOutlineTrash, HiSignal, HiSignalSlash} from 'react-icons/hi2'
import DeletePostDialog from './DeletePostDialog'

type postMenuProps = {
  post: postProps
  currentUser: userProps
  className?: string
}

const PostMenu = ({post, currentUser, className}: postMenuProps) => {
  const isAuthor = post.author._id === currentUser._id;
  const notificationOff = post.hideNotification;
  const hidePostOn = post.hidePost;

  const [showDeletePostDialog, setShowDeletePostDialog] = React.useState(false)

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
            <DropdownMenuItem className='cursor-pointer'>
              <div className="flex items-center gap-3">
                { notificationOff ? <HiOutlineBellAlert size={22} className='text-green-500 hidden sm:block'/> : <HiOutlineBellSlash size={22} className='text-destructive hidden sm:block'/>}
                { notificationOff ? <HiOutlineBellAlert size={18} className='text-green-500 hidden sm:hidden'/> : <HiOutlineBellSlash size={18} className='text-destructive sm:hidden'/>}
                <p className='text-sm sm:text-base'>{ notificationOff ? 'On notitification' : 'Off notitification' }</p>
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
            <DropdownMenuItem className='cursor-pointer'>
              <div className="flex items-center gap-3">
                { hidePostOn ? <HiSignal size={22} className='text-green-500 hidden sm:block'/> : <HiSignalSlash size={22} className='text-destructive hidden sm:block'/>}
                { hidePostOn ? <HiSignal size={18} className='text-green-500 sm:hidden'/> : <HiSignalSlash size={18} className='text-destructive sm:hidden'/>}
                <p className='text-sm sm:text-base'>{ hidePostOn ? 'Unhide post' : 'Hide post' }</p>
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