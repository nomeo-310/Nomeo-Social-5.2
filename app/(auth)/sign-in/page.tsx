import React from 'react'
import { Metadata } from 'next';
import AuthLayout from '../components/AuthLayout';
import SignInForm from '../components/SignInForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sign In"
};

const Page = () => {
  return (
    <AuthLayout desktopImageSrc='/images/bg_1a.jpg' mobileImageSrc='/images/bg_1b.jpg'>
      <div className="flex flex-col gap-4">
        <div className='mb-3'>
          <h2 className='font-bold text-3xl lg:text-4xl mb-3 text-center'>Sign In</h2>
          <p className='lg:text-lg text-center'>Welcome back, We are so excited to inform you that we added some new cool features and interface just to make your experience more fun and enable you create moments easily.</p>
        </div>
        <SignInForm/>
        <p className='text-center'>Don&apos;t have an account yet? <Link href={'/sign-up'} className='underline'> Sign up</Link></p>
      </div>
    </AuthLayout>
  )
}

export default Page;
