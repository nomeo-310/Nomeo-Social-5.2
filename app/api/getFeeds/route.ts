import { getCurrentUser } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Post from "@/models/posts";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectToMongoDB();

  try {
    const value = request.nextUrl.searchParams.get('page') || undefined;
    const page = parseInt(value as string);
    const pageSize = 10;
    
    const currentUser = await getCurrentUser();


    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    }

    const posts = await Post.find({hidePost: false, isBarred: false})
    .populate('author', '_id username displayName image followers following city state')
    .populate('attachments', '_id url type')
    .sort({createdAt: 'descending'})
    .skip((page - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = posts.length > pageSize ? page + 1 : undefined;

    const data = {
      posts: posts.slice(0, pageSize),
      nextPage: nextPage
    };

    return Response.json(data);
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'}, {status: 500});
  }
};