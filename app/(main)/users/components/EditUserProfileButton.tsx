'use client'


import { Button } from '@/components/ui/button'
import { userProps } from '@/types/types'
import React from 'react'
import EditProfileDialog from './EditProfileDialog'

type editUserProfileButtonProps = {
  user: userProps
}

const EditUserProfileButton = ({user}: editUserProfileButtonProps) => {
  const [showDialog, setShowDialog] = React.useState(false);

  return (
    <React.Fragment>
      <Button variant={'outline'} onClick={() => setShowDialog(true)} className='rounded-full'>
        <p className='text-base'>Edit profile</p>
      </Button>
      <EditProfileDialog user={user} open={showDialog} onOpenChange={setShowDialog}/>
    </React.Fragment>
  )
}

export default EditUserProfileButton