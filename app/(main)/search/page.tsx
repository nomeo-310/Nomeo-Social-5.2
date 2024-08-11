import { getCurrentUser } from '@/lib/authAction';
import { Metadata } from 'next'
import React from 'react'
import TrendsSideBar from '../components/TrendsSideBar';


export const generateMetadata = ({searchParams: {query}}: searchPageProps):Metadata => {
  return {
    title: `Search results for "${query}"`
  }
};

type searchPageProps = {
  searchParams: {query: string}
};

const Page = async ({searchParams: {query}}: searchPageProps) => {
  const currentUser = await getCurrentUser();

  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <div className="rounded-md bg-card p-4 shadow-sm">
          <h2 className="font-bold text-2xl text-center">Search results for &quot;${query}&quot;</h2>
        </div>
      </div>
      <TrendsSideBar currentUser={currentUser}/>
    </main>
  );
};

export default Page