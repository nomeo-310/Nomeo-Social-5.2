import { NextRequest } from "next/server";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { getCurrentUser } from "@/lib/authAction";
import Media from "@/models/media";

export const POST = async (request:Request) => {
  const { page } = await request.json();

  await connectToMongoDB();

  try {
    const value = page || undefined;
    const pageNumber = parseInt(value as string);
    const pageSize = 6;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const media = await Media.find({author: currentUser._id, type: 'video'})
    .populate('post', '_id content createdAt')
    .sort({createdAt: 'descending'})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = media.length > pageSize ? pageNumber + 1 : undefined;

    const data = {
      videos: media.slice(0, pageSize),
      nextPage: nextPage
    };

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'}, {status: 500}); 
  }
}