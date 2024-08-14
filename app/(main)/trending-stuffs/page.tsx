import React from "react";
import { getSuggestedFollowers } from "../actions/userActions";
import { Loader2 } from "lucide-react";
import { suggestedUserProps, userProps } from "@/types/types";
import Link from "next/link";
import { getTrendingTopics } from "../actions/postActions";
import { formatNumber } from "@/lib/utils";
import ImageAvatar from "../components/ImageAvatar";
import FollowButton from "../components/FollowButton";
import { getCurrentUser } from "@/lib/authAction";

const page = async () => {
  const currentUser = await getCurrentUser();

  const SuggestFollowerList = async () => {
    const suggestedFollowers = await getSuggestedFollowers();

    return (
      <div className="space-y-4 rounded-md bg-card p-4 shadow-sm">
        <div className="font-bold text-2xl">Who to follow</div>
        {suggestedFollowers.map((suggestion: suggestedUserProps) => (
          <div
            key={suggestion._id}
            className="flex items-center justify-between gap-3"
          >
            <Link
              href={`/users/${suggestion.username}`}
              className="flex items-center gap-3"
            >
              <ImageAvatar
                imgSrc={suggestion?.image}
                className="flex-none border"
              />
              <div className="text-base">
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {suggestion.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{suggestion.username}
                </p>
              </div>
            </Link>
            <FollowButton
              userId={suggestion._id}
              initialState={{
                followers: suggestion.followers.length,
                isFollowedBy: suggestion.followers.includes(currentUser._id),
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const TrendingTopicList = async () => {
    const hashtagList = await getTrendingTopics();

    return (
      <div className="space-y-4 rounded-md bg-card shadow-sm p-4">
        <div className="font-bold text-2xl">Trending topics</div>
        {hashtagList.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];
          return (
            <Link href={`/hashtags/${title}`} key={title} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline text-base lg:text-lg"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="lg:text-base text-sm text-muted-foreground">
                {formatNumber(count)} {count === 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <div className="sticky top-[5rem] sm:hidden w-full h-fit flex-none space-y-4">
      <React.Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <SuggestFollowerList />
        <TrendingTopicList />
      </React.Suspense>
    </div>
  );
};

export default page;
