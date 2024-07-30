import { getCurrentUser } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Post from "@/models/posts";

export const GET = async () => {
  await connectToMongoDB();
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'})
    }

    const posts = await Post.find()
    .populate('author', '_id username displayName image')
    .sort({createdAt: 'descending'});

    return Response.json(posts)
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'});
  }
}