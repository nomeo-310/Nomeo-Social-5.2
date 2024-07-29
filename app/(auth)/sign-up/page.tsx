import React from 'react'
import { Metadata } from 'next';
import AuthLayout from '../components/AuthLayout';
import SignUpForm from '../components/SignUpForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Sign Up"
};

const page = () => {
  return (
    <AuthLayout imageSrc='/images/bg_2.jpg'>
      <div className="flex flex-col gap-4 ">
        <div>
          <h2 className='font-bold text-3xl lg:text-4xl mb-3 text-center'>Sign Up</h2>
          <p className='lg:text-lg text-center'>Welcome to Nomeo Social, a social community that encourage connections and creativity.</p>
        </div>
        <SignUpForm/>
        <p className='text-center'>Already have an account? <Link href={'/sign-in'} className='underline'> Log in</Link></p>
      </div>
    </AuthLayout>
  )
}

export default page