'use client'

import React from 'react'
import { commentProps } from '@/types/types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { HiEllipsisHorizontal, HiOutlineTrash} from 'react-icons/hi2'
import DeleteCommentDialog from './DeleteCommentDialog'

type postMenuProps = {
  comment: commentProps
  className?: string
};

const CommentMenu = ({comment, className}: postMenuProps) => {

  const [showDeleteCommentDialog, setShowDeleteCommentDialog] = React.useState(false);

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
          <DropdownMenuItem className='cursor-pointer' onClick={() => setShowDeleteCommentDialog(true)}>
            <div className="flex items-center gap-3">
              <HiOutlineTrash size={22} className='text-destructive hidden sm:block'/>
              <HiOutlineTrash size={18} className='text-destructive sm:hidden'/>
              <p className='text-sm sm:text-base'>Delete comment</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      { showDeleteCommentDialog && 
        <DeleteCommentDialog
          open={showDeleteCommentDialog}
          onClose={() => setShowDeleteCommentDialog(false)}
          comment={comment}
        />
      }
    </React.Fragment>
  )
}

export default CommentMenu