'use client'


import React from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { HiMagnifyingGlass } from 'react-icons/hi2'


const SearchField = () => {
  const router = useRouter();

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const query = (form.q as HTMLInputElement).value.trim();

    if (!query) {
      return;
    };

    router.push(`/search?query=${encodeURIComponent(query)}`)
  };

  return (
    <form onSubmit={handleSearch} method='GET' action={'/search'}>
      <div className="relative">
        <Input name='q' placeholder='Search anything...' className='pe-10 rounded-full lg:w-80'/>
        <HiMagnifyingGlass className='size-6 absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground'/>
      </div>
    </form>
  )
}

export default SearchField
