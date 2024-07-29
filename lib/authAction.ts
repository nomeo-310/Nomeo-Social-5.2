'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import prisma from "./prisma";

export const getUserSession = async () => {
  return await getServerSession(authOptions);
};

export const getCurrentUserRawData = async () => {
  const session = await getUserSession();

  if (!session?.user?.email) {
    return;
  };

  const currentUser = await prisma.user.findFirst({
    where: {email: {
      equals: session.user.email,
      mode: 'insensitive'
    }}
  });

  if (!currentUser) {
    return;
  }

  return currentUser
};

export const getCurrentUser = async () => {
  const session = await getUserSession();

  if (!session?.user?.email) {
    return;
  };

  const currentUserRawValue = await prisma.user.findFirst({
    where: {email: {
      equals: session.user.email,
      mode: 'insensitive'
    }}
  });

  if (!currentUserRawValue) {
    return;
  }

  const currentUser = JSON.parse(JSON.stringify(currentUserRawValue));

  return currentUser
};