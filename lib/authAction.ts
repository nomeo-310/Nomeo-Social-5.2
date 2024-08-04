'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import { connectToMongoDB } from "./connectToMongoDb";
import User from "@/models/users";

export const getUserSession = async () => {
  return await getServerSession(authOptions);
};

export const getCurrentUserRawData = async () => {

  const session = await getUserSession();

  if (!session?.user?.email) {
    return;
  };

  const currentUser = await User.findOne({email: session.user.email});

  if (!currentUser) {
    return;
  }

  return currentUser
};

export const getCurrentUser = async () => {
  await connectToMongoDB();

  const session = await getUserSession();

  if (!session?.user?.email) {
    return;
  };

  const currentUserRawValue = await User.findOne({email: session.user.email});

  if (!currentUserRawValue) {
    return;
  }

  const currentUser = JSON.parse(JSON.stringify(currentUserRawValue));

  return currentUser
};

export const getUserByUsername = async (username:string) => {
  await connectToMongoDB();

  const currentUserRawValue = await User.findOne({username: username});

  if (!currentUserRawValue) {
    return;
  }

  const currentUser = JSON.parse(JSON.stringify(currentUserRawValue));

  return currentUser
};

export const getUserByEmail = async (email:string) => {
  await connectToMongoDB();

  const currentUserRawValue = await User.findOne({email: email});

  if (!currentUserRawValue) {
    return;
  }

  const currentUser = JSON.parse(JSON.stringify(currentUserRawValue));

  return currentUser
};
