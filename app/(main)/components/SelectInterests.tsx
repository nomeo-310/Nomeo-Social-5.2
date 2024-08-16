'use client'

import React from 'react'
import { userProps } from '@/types/types'
import InterestDialog from './InterestDialog'
import { createUserInterests } from '../actions/userActions'
import { toast } from 'sonner'

type selectInterestProps = {
  currentUser: userProps
}

const SelectInterests = ({currentUser}: selectInterestProps) => {
  const [interests, setInterests] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(currentUser.interestSelected === false);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    await createUserInterests(interests)
    .then((response) => {
      if (response.success) {
        setIsLoading(false);
        setShowDialog(false)
      }
    }).catch (error => {
      console.error(error)
      setIsLoading(false);
      toast.error('Error occured while submitting interest, try again later')
    });
  };



  return (
    <InterestDialog 
      open={showDialog} 
      onOpenChange={setShowDialog}
      interests={interests}
      setInterests={setInterests}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
    />
  )
}

export default SelectInterests