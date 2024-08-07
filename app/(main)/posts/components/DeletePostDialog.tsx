import React from 'react'
import { postProps } from '@/types/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import LoadingButton from '@/components/common/LoadingButton'
import { Button } from '@/components/ui/button'
import { useDeletePostMutation } from '../../hooks/deletePostMutation'

type deletePostDialogProps = {
  post: postProps
  open: boolean
  onClose: () => void
}

const DeletePostDialog = ({post, open, onClose}: deletePostDialogProps) => {
  const mutation = useDeletePostMutation();

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
          <p className='text-lg lg:text-xl'>Delete post?</p>
          </DialogTitle>
          <DialogDescription>
          <p className='text-base lg:text-lg'>Are you sure you want to delete this post? This action cannot be undone</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton 
            variant={'destructive'} 
            onClick={() => mutation.mutate(post._id, {onSuccess: onClose})} 
            loading={mutation.isPending} 
            className='rounded-full focus:outline-none outline-none'
          >
            <p className='text-base'>Delete post</p>
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

export default DeletePostDialog