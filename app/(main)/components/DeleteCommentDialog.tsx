import React from 'react'
import { commentProps } from '@/types/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LoadingButton from '@/components/common/LoadingButton'
import { Button } from '@/components/ui/button'
import { useDeleteCommentMutation } from '../hooks/deleteCommentMutation'

type deletePostDialogProps = {
  comment:commentProps
  open: boolean
  onClose: () => void
}

const DeleteCommentDialog = ({comment, open, onClose}: deletePostDialogProps) => {
  const mutation = useDeleteCommentMutation();

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
          <p className='text-lg lg:text-xl'>Delete comment?</p>
          </DialogTitle>
          <DialogDescription>
          <p className='text-base lg:text-lg'>Are you sure you want to delete this comment? This action cannot be undone</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton 
            variant={'destructive'} 
            onClick={() => mutation.mutate(comment._id, {onSuccess: onClose})} 
            loading={mutation.isPending} 
            className='rounded-full focus:outline-none outline-none'
          >
            <p className='text-base'>Delete comment</p>
          </LoadingButton>
          <Button
            variant={'outline'}
            onClick={onClose}
            disabled={mutation.isPending} 
            className='rounded-full focus:outline-none'
          >
            <p className='text-base'>Cancel</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteCommentDialog