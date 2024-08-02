'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import User from "@/models/users";

export const getSuggestedFollowers = async () => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) {
    return;
  }

  const followings = currentUser.following;

  const suggestions = await User.find({_id: {$nin: followings}, name: {$ne: currentUser.name}})
  .select('_id username displayName image followers')
  .limit(5);

  const suggestedFollowers = JSON.parse(JSON.stringify(suggestions))

  return suggestedFollowers;
};
