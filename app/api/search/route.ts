import { getCurrentUser } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Post from "@/models/posts";
import User from "@/models/users";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectToMongoDB();

  try {
    const query = request.nextUrl.searchParams.get('query') || "";
    const value = request.nextUrl.searchParams.get('page') || undefined;

    const userQuery = { $or: [{ name: new RegExp(query, 'i')},{ username: new RegExp(query, 'i') },{ displayName: new RegExp(query, 'i')}]}
    
    const page = parseInt(value as string);
    const pageSize = 10;
    
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const users = await User.find(userQuery)
    const userArrays = JSON.parse(JSON.stringify(users))
    const userIds = userArrays.map((item: { _id: string; }) => item._id)

    const matchAuthor = { author: { $in: userIds }}
    const contentQuery = { content: { $regex: query, $options: 'i' }}
    const postQuery = {$or: [matchAuthor, contentQuery]}


    const posts = await Post.find(postQuery)
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
    return Response.json({error: 'Internal server error'}, {status: 500})
  }
}
