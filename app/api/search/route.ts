import { getCurrentUser } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Attachment from "@/models/attachments";
import Post from "@/models/posts";
import User from "@/models/users";

export const POST = async (request:Request) => {
  const { query, page } = await request.json();

  await connectToMongoDB();

  try {
    const value = page || undefined;

    const userQuery = { $or: [{ name: new RegExp(query, 'i')},{ username: new RegExp(query, 'i') },{ displayName: new RegExp(query, 'i')}]}
    
    const pageNumber = parseInt(value as string);
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
    .populate({
      path: 'author',
      model: User,
      select: '_id username displayName image followers following city state'
    })
    .populate({
      path: 'attachments',
      model: Attachment,
      select: '_id url type'
    })
    .sort({createdAt: 'descending'})
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize + 1);



    const nextPage = posts.length > pageSize ? pageNumber + 1 : undefined;

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
