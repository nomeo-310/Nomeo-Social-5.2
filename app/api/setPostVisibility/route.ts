import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Post from "@/models/posts";

export const GET = async (request:Request) => {
  await connectToMongoDB();

  const { postId } = await request.json();

  try {
    const currentUser = await getCurrentUserRawData();

    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    const post = await Post.findOne({_id: postId})
    
    if (!post) {
      return Response.json({error: 'Post not found'}, {status: 404})
    };

    const visibilityStatus = post.hidePost;

    const data = { visibilityStatus: visibilityStatus };

    return Response.json(data);
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};

export const POST = async (request:Request) => {
  await connectToMongoDB();

  const { postId } = await request.json();
  try {
    const currentUser = await getCurrentUserRawData();
  
    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    const post = await Post.findOne({_id: postId})
    
    if (!post) {
      return Response.json({error: 'Post not found'}, {status: 404})
    };

    await Post.findOneAndUpdate({_id: postId}, {hidePost: true})
    return Response.json({success: 'You have hidden this post from public view'}, {status: 200})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};

export const PUT = async (request:Request) => {
  await connectToMongoDB();

  const { postId } = await request.json();

  try {
    const currentUser = await getCurrentUserRawData();

    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    const post = await Post.findOne({_id: postId})
    
    if (!post) {
      return Response.json({error: 'Post not found'}, {status: 404})
    };

    await Post.findOneAndUpdate({_id: postId}, {hidePost: false})

    return Response.json({success: 'You have returned this post to public view'}, {status: 200})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};