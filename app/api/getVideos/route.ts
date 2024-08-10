import { NextRequest } from "next/server";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { getCurrentUser } from "@/lib/authAction";
import Media from "@/models/media";

export const GET = async (request: NextRequest) => {
  await connectToMongoDB();

  try {
    const value = request.nextUrl.searchParams.get('page') || undefined;
    const page = parseInt(value as string);
    const pageSize = 6;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const media = await Media.find({author: currentUser._id, type: 'video'})
    .populate('post', '_id content createdAt')
    .sort({createdAt: 'descending'})
    .skip((page - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = media.length > pageSize ? page + 1 : undefined;

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