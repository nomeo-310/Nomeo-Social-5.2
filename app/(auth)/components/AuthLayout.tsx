'use client'

import React from 'react'
import Image from 'next/image'

type layoutProps = {
  children: React.ReactNode
  mobileImageSrc: string
  desktopImageSrc: string
}

const AuthLayout = ({children, mobileImageSrc, desktopImageSrc}:layoutProps) => {
  return (
    <div className='flex h-screen md:p-3 md:gap-3 lg:p-4 lg:gap-4 font-urbanist'>
      <div className="xl:w-[32%] lg:w-[35%] md:w-[45%] hidden md:flex items-center">
        <div className="w-full">
          {children}
        </div>
      </div>
      <div className="xl:w-[68%] lg:w-[65%] md:w-[55%] w-full h-full flex items-center justify-center relative md:rounded-md overflow-hidden">
        <div className="absolute w-full h-full bg-black/30 z-30"/>
        <Image src={mobileImageSrc} alt='background_1' fill priority className='object-cover sm:hidden'/>
        <Image src={desktopImageSrc} alt='background_1' fill priority className='object-cover hidden sm:block'/>
        <div className="w-[90%] sm:hidden bg-black/40 z-50 h-fit text-white py-6 px-4 rounded-md slide-in-top">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
