import { getCurrentUser } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
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
    }

    const posts = await Post.find({hidePost: false, isBarred: false})
    .populate('author', '_id username displayName image followers following city state')
    .populate('attachments', '_id url type')
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
    return Response.json({error: 'Internal server error, try again later'}, {status: 500});
  }
};