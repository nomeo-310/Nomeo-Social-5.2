import React from 'react'
import { Metadata } from 'next';
import TrendsSideBar from '../components/TrendsSideBar';
import { getCurrentUser } from '@/lib/authAction';
import VideoGallery from './components/VideoGallery';


export const metadata: Metadata = {
  title: "Video Gallery"
};


const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-md bg-card p-4 shadow-sm">
          <h2 className="font-bold text-2xl text-center">Video Gallery</h2>
        </div>
        <VideoGallery/>
      </div>
      <TrendsSideBar currentUser={currentUser}/>
    </main>
  )
}

export default page