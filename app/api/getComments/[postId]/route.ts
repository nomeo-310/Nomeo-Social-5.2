import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb"
import Comments from "@/models/comments";
import Post from "@/models/posts";
import { NextRequest } from "next/server";

export const GET = async (request:NextRequest, {params: { postId }}: {params: {postId: string}}) => {
  await connectToMongoDB();

  try {
    const value = request.nextUrl.searchParams.get('page') || undefined;

    const page = parseInt(value as string);
    const pageSize = 5;

    const currentUser = await getCurrentUserRawData();
    if (!currentUser) {
      return Response.json({error: 'Unauthorized'}, {status: 402})
    };

    const post = await Post.find({_id: postId});
    if (!post) {
      return Response.json({error: 'Post does not exist'}, {status: 401})
    };

    const comments = await Comments.find({post: postId})
    .populate('author', '_id username displayName image followers following city')
    .sort({createdAt: 'ascending'})
    .skip((page - 1) * pageSize)
    .limit(-pageSize - 1);

    const previousPage = comments.length > pageSize ? page : undefined;

    const data = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousPage: previousPage
    };

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500})
  }
}