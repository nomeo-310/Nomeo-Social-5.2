'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { updateProfileSchema, updateProfileValues } from "@/lib/validation";
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

export const updateUserProfile = async (values: updateProfileValues) => {
  await connectToMongoDB();

  const validatedValues = updateProfileSchema.parse(values);
  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw new Error('Unauthorized');

  const updatedUser = await User.findOneAndUpdate({_id: currentUser._id}, validatedValues);

  const updateData = JSON.parse(JSON.stringify(updatedUser));

  return updateData;
};
