import { NextRequest } from "next/server";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { getCurrentUser } from "@/lib/authAction";
import Notifications from "@/models/notifications";

export const GET = async (request: NextRequest) => {
  await connectToMongoDB();

  try {
    const value = request.nextUrl.searchParams.get('page') || undefined;
    const page = parseInt(value as string);
    const pageSize = 10;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const notifications = await Notifications.find({recipient: currentUser._id})
    .populate('issuer', 'displayName username image')
    .populate('post', '_id content')
    .sort({createdAt: 'descending'})
    .skip((page - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = notifications.length > pageSize ? page + 1 : undefined;

    const data = {
      notifications: notifications.slice(0, pageSize),
      nextPage: nextPage
    };

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'}, {status: 500}); 
  }
}