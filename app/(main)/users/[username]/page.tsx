import React from 'react'
import { getCurrentUser, getUserByUsername } from '@/lib/authAction';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import TrendsSideBar from '../../components/TrendsSideBar';
import { followUserInfoProps, userProps } from '@/types/types';
import ImageAvatar from '../../components/ImageAvatar';
import { formatDate } from 'date-fns';
import { formatNumber } from '@/lib/utils';
import FollowerCount from '../../components/FollowerCount';
import FollowButton from '../../components/FollowButton';
import EditUserProfileButton from '../components/EditUserProfileButton';
import UserFeeds from '../../posts/components/UserFeeds';

type profilePageProps = {
  params: {username: string}
};

type userProfileProps = {
  user: userProps
  loggedInUser: userProps
};

const getUser = React.cache(async (username: string) => {
  const user = await getUserByUsername(username);

  if (!user) notFound();

  return user
});

export const generateMetadata = async ({params: {username}}: profilePageProps):Promise<Metadata> => {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) return {};

  const user = await getUser(username);

  return {
    title: `${user.displayName}`
  };
};

const Page = async ({params: {username}}: profilePageProps) => {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) {
    return (
      <p className='text-base text-destructive md:text-lg lg:text-xl'>
        You&apos;re not authorized to view this page
      </p>
    )
  };

  const user = await getUser(username);

  const UserProfile = async ({user, loggedInUser}:userProfileProps) => {

    const followerInfo:followUserInfoProps = {
      followers: user.followers.length,
      isFollowedBy: user.followers.some((id) => id === loggedInUser._id)
    };

    return (
      <div className="w-full h-fit space-y-4 rounded-md bg-card p-4 shadow-sm">
        <ImageAvatar imgSrc={user.image} className='size-36 md:size-44 xl:size-56 mx-auto max-w-60'/>
        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
          <div className="me-auto space-y-3">
            <div>
              <h2 className='text-2xl lg:text-3xl font-bold'>{user.displayName}</h2>
              <p className='text-muted-foreground text-base lg:text-lg'>@{user.username}</p>
            </div>
            <h2 className='text-base lg:text-lg'>Member since {formatDate(user.createdAt, 'MMM d, yyyy')}</h2>
            <div className="flex items-center gap-3">
              <span className='text-base lg:text-lg'>
                Posts: {" "}
                <span className='font-semibold'>{formatNumber(user.posts.length)}</span>
              </span>
              <FollowerCount userId={user._id} initialState={followerInfo}/>
            </div>
          </div>
          {user._id === loggedInUser._id ? 
            <EditUserProfileButton user={loggedInUser}/> : 
            <FollowButton userId={user._id} initialState={followerInfo}/>
          }
        </div>
        {user.bio && (
          <React.Fragment>
            <hr/>
            <div className='overflow-hidden whitespace-pre-line break-words text-base'>{user.bio}</div>
          </React.Fragment>
        )}
      </div>
    )
  };

  return (
    <main className='flex w-full min-w-0 gap-4'>
      <div className="w-full min-w-0 space-y-4">
        <UserProfile user={user} loggedInUser={loggedInUser}/>
        <div className="rounded-md bg-card font-semibold p-4 shadow-sm">
          <h2 className='text-center text-xl md:text-2xl xl:text-3xl'>
            {loggedInUser._id === user._id ? 'All your posts.' :  `${user.displayName}'s posts.`}
          </h2>
        </div>
        <UserFeeds currentUser={user}/>
      </div>
      <TrendsSideBar currentUser={loggedInUser}/>
    </main>
  )
};

export default Page