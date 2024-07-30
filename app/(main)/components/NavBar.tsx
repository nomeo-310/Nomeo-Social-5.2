import Link from 'next/link'
import React from 'react'
import UserButton from './UserButton'
import { userProps } from '@/types/types'
import SearchField from './SearchField'

interface navBarProps {
  currentUser: userProps
}

const NavBar = ({currentUser}: navBarProps) => {
  return (
    <header className='sticky top-0 z-10 bg-card shadow-sm'>
      <div className='max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-5 px-5 py-3'>
        <Link href={'/'} className='text-2xl text-primary font-bold font-urbanist'>Nomeo Social</Link>
        <SearchField/>
        <UserButton currentUser={currentUser} className='sm:ms-auto'/>
      </div>
    </header>
  )
}

export default NavBar
