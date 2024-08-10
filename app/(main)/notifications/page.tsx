import React from 'react'
import { Metadata } from 'next';
import { getCurrentUser } from '@/lib/authAction';
import NotificationsClient from './components/NotificationsClient';
import TrendsSideBar from '../components/TrendsSideBar';


export const metadata: Metadata = {
  title: "Notifications"
};

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-md bg-card p-4 shadow-sm">
          <h2 className="font-bold text-2xl text-center">Notifications</h2>
        </div>
        <NotificationsClient currentUser={currentUser} />
      </div>
      <TrendsSideBar currentUser={currentUser}/>
    </main>
  );
};

export default page;