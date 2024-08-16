'use client'

import LoadingButton from '@/components/common/LoadingButton'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DialogDescription } from '@radix-ui/react-dialog'
import { LucideCode2, LucideDices, LucideFilm, LucideGem, LucideImage, LucideLeaf, LucideLibrary, LucideLineChart, LucideMic, LucideMusic, LucidePalette, LucidePlane, LucideSparkles, LucideTags, LucideTrendingUp, LucideUtensilsCrossed } from 'lucide-react'
import React from 'react'

type interestProps = {
  name: string
  icon:any
  id:string
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}

type interestDialogProps = {
  open:boolean
  onOpenChange: (open: boolean) => void;
  isLoading: boolean
  handleSubmit: () => void
  interests: string[]
  setInterests: React.Dispatch<React.SetStateAction<string[]>>
}

const InterestDialog = ({ open, onOpenChange, isLoading, handleSubmit, interests, setInterests }:interestDialogProps) => {

  const interestList = [
    {name: 'Tech Stuffs', icon: LucideCode2, id: 'tech-stuff'},
    {name: 'Photography', icon: LucideImage, id: 'photography'},
    {name: 'Music', icon: LucideMusic, id: 'music'},
    {name: 'Gaming', icon: LucideDices, id: 'gaming'},
    {name: 'Movies', icon: LucideFilm, id: 'movies'},
    {name: 'Foods & Wines', icon: LucideUtensilsCrossed, id: 'food-wines'},
    {name: 'Travels & Tours', icon: LucidePlane, id: 'travel-tours'},
    {name: 'Romance', icon: LucideSparkles, id: 'romance'},
    {name: 'Arts', icon: LucidePalette, id: 'arts'},
    {name: 'Fashion', icon: LucideTags, id: 'fashion'},
    {name: 'Latest Trends', icon: LucideTrendingUp, id: 'latest-trends'},
    {name: 'Podcasts', icon: LucideMic, id: 'podcasts'},
    {name: 'Business & Trades', icon: LucideLineChart, id: 'business-trades'},
    {name: 'Health Tips', icon: LucideLeaf, id: 'health-tips'},
    {name: 'Books & Novels', icon: LucideLibrary, id: 'books-novels'},
    {name: 'Daily Motivation', icon: LucideGem, id: 'daily-motivation'},
  ];

  const SingleInterest = ({name, icon:Icon, id, selectedItems, setSelectedItems}:interestProps) => {

    const [isChecked, setIsChecked] = React.useState(selectedItems.includes(name));
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    const handleClick = React.useCallback(() => {

      if (checkboxRef.current) {
        checkboxRef.current.checked = !isChecked;
        setIsChecked(!isChecked);
  
        if (isChecked) {
          setSelectedItems(selectedItems.filter(item => item !== name));
        } else {
          setSelectedItems([...selectedItems, name]);
        }
      }
    }, [isChecked, selectedItems, setSelectedItems, name]);

    return (
      <label className={cn("py-2 px-3.5 flex items-center gap-3 cursor-pointer border rounded-full", isChecked && 'bg-primary text-white border-0')} onClick={handleClick}>
        <p className='text-base'>{name}</p>
        <Icon className='sm:size-6 size-5'  name={name} />
        <Input id={id} className='hidden sr-only' name='interests' ref={checkboxRef} checked={isChecked} type='checkbox'/>
      </label>
    )
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[390px] rounded">
        <DialogHeader>
          <DialogTitle>
            <p className="text-xl lg:text-2xl text-center">What are your interests?</p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className='text-center'>Welcome to Nomeo Social 5.2!! This won&apos;t take more than a few seconds. You can select as many as you like.</p>
        </DialogDescription>
        <div className="flex flex-wrap gap-2 w-full items-center">
          { interestList.map((interest, index:number) => (
            <SingleInterest 
              key={index}
              id={interest.id}
              name={interest.name}
              icon={interest.icon}
              selectedItems={interests}
              setSelectedItems={setInterests}
            />
          ))}
        </div>
        <DialogFooter>
          <LoadingButton className="rounded-full" disabled={isLoading || interests.length < 3} loading={isLoading} onClick={() => handleSubmit()}>
            <p className="text-base">{ isLoading ? 'Submitting...' : 'Submit' }</p>
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default InterestDialog