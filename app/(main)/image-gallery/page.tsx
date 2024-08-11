import React from 'react'
import { Metadata } from 'next';
import ImageGallery from './components/ImageGallery';
import TrendsSideBar from '../components/TrendsSideBar';
import { getCurrentUser } from '@/lib/authAction';


export const metadata: Metadata = {
  title: "Image Gallery"
};


const Page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-md bg-card p-4 shadow-sm">
          <h2 className="font-bold text-2xl text-center">Image Gallery</h2>
        </div>
        <ImageGallery/>
      </div>
      <TrendsSideBar currentUser={currentUser}/>
    </main>
  )
}

export default Page