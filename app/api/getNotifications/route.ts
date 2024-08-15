import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { getCurrentUser } from "@/lib/authAction";
import Notifications from "@/models/notifications";
import User from "@/models/users";
import Post from "@/models/posts";

export const POST = async (request:Request) => {
  const { page } = await request.json();
  
  await connectToMongoDB();

  try {
    const value = page || undefined;
    const pageNumber = parseInt(value as string);
    const pageSize = 10;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const notifications = await Notifications.find({recipient: currentUser._id})
    .populate({
      path: 'issuer',
      model: User,
      select: 'displayName username image'
    })
    .populate({
      path: 'post',
      model: Post,
      select: '_id content' 
    })
    .sort({createdAt: 'descending'})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = notifications.length > pageSize ? pageNumber + 1 : undefined;

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