import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb"
import Bookmarks from "@/models/bookmarks";
import Post from "@/models/posts";
import User from "@/models/users";

export const GET = async (request: Request) => {
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

    const bookmark = await Bookmarks.findOne({post: postId, user: currentUser._id})

    const data = {isBookmarkedByUser: !!bookmark}

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
    
    const bookmarkData = {
      user: currentUser._id,
      post: postId
    };

    const bookmark = await Bookmarks.create(bookmarkData);
    bookmark.save();

    await Post.findOneAndUpdate({_id: postId}, {$push: {bookmarks: currentUser._id}})
    await User.findOneAndUpdate({_id: currentUser._id}, {$push: {bookmarks: postId}})

    return Response.json({success: 'You bookmarked this post'}, {status: 200})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};

export const DELETE = async (request: Request) => {
  await connectToMongoDB();

  const { postId } = await request.json();

  try {
    const currentUser = await getCurrentUserRawData();

    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    await Bookmarks.deleteMany({user: currentUser._id, post: postId})

    await Post.findOneAndUpdate({_id: postId}, {$pull: {bookmarks: currentUser._id}})
    await User.findOneAndUpdate({_id: currentUser._id}, {$pull: {bookmarks: postId}})

    return Response.json({success: 'You have unbookmarked post'}, {status: 200})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};

