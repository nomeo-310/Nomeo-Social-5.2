import React, { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/authAction";
import { getSinglePost } from "../../actions/postActions";
import ImageAvatar from "../../components/ImageAvatar";
import Link from "next/link";
import { HiOutlineBriefcase, HiOutlineMapPin } from "react-icons/hi2";
import { Loader2 } from "lucide-react";
import Linkify from "../../components/Linkify";
import FollowButton from "../../components/FollowButton";
import PostCard from "../components/PostCard";

type postPageProps = {
  params: { postId: string };
};

type userDataProp = {
  username: string;
  displayName: string;
  image: string;
  _id: string;
  bio: string;
  city: string;
  state: string;
  country: string;
  occupation: string;
  followers: string[];
  following: string[];
};

type userInfoSidebarProps = {
  userInfo: userDataProp;
};

const getPost = React.cache(async (postId: string) => {
  const post = await getSinglePost(postId);

  if (!post) notFound();

  return post;
});

export const generateMetadata = async ({
  params: { postId },
}: postPageProps): Promise<Metadata> => {
  const post = await getPost(postId);

  return {
    title: `${post.author.displayName}`,
  };
};

const Page = async ({ params: { postId } }: postPageProps) => {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) {
    return (
      <p className="text-base text-destructive md:text-lg lg:text-xl">
        You&apos;re not authorized to view this page
      </p>
    );
  }

  const post = await getPost(postId);

  return (
    <main className="flex w-full min-w-0 gap-4">
      <div className="w-full min-w-0 space-y-4">
        <PostCard post={post} currentUser={loggedInUser} />
      </div>
      <div className="sticky top-[5rem] hidden md:block lg:w-80 w-72 h-fit flex-none space-y-4">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSideBar userInfo={post.author} />
        </Suspense>
      </div>
    </main>
  );
};

const UserInfoSideBar = async ({ userInfo }: userInfoSidebarProps) => {
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) return null;

  return (
    <div className="space-y-4 rounded-md bg-card p-4 shadow-sm">
      <div className="font-bold text-2xl">About this user</div>
      <Link
        href={`/users/${userInfo.username}`}
        className="flex items-center gap-3"
      >
        <ImageAvatar imgSrc={userInfo?.image} className="flex-none border" />
        <div className="text-base">
          <p className="line-clamp-1 break-all font-semibold hover:underline">
            {userInfo.displayName}
          </p>
          <p className="line-clamp-1 break-all text-muted-foreground">
            @{userInfo.username}
          </p>
        </div>
      </Link>
      <div>
        <div className="flex items-center gap-3">
          <HiOutlineMapPin size={20} />
          <p className="text-base">
            {userInfo.state}, {userInfo.country}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HiOutlineBriefcase size={20} />
          <p className="text-base">{userInfo.occupation}</p>
        </div>
      </div>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {userInfo.bio}
        </div>
      </Linkify>
      {userInfo._id !== loggedInUser._id && (
        <FollowButton
          userId={userInfo._id}
          initialState={{
            followers: userInfo.followers.length,
            isFollowedBy: userInfo.followers.includes(loggedInUser._id),
          }}
        />
      )}
    </div>
  );
};

export default Page;
