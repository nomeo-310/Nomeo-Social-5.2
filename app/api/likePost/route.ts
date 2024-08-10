import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Likes from "@/models/likes";
import Notifications from "@/models/notifications";
import Post from "@/models/posts";
import User from "@/models/users";

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

    const postLikes = await Likes.countDocuments({post: postId});
    const like = await Likes.find({post: postId, user: currentUser._id});

    const data = {
      likes: postLikes,
      isLikedByUser: !!like.length
    };

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

    const likeData = {
      user: currentUser._id,
      post: postId
    };

    const like = await Likes.create(likeData);
    like.save();

    await Post.findOneAndUpdate({_id: postId}, {$push: {likes: currentUser._id}})
    await User.findOneAndUpdate({_id: currentUser._id}, {$push: {likes: postId}})

    if (post.hideNotification === false && JSON.stringify(post.author) !== JSON.stringify(currentUser._id)) {
      
      const notificationData = {
        issuer: currentUser._id,
        recipient: post.author,
        post: postId,
        type: 'like-post'
      };

      const notification = await Notifications.create(notificationData)
      notification.save();

      await User.findOneAndUpdate({_id: post.author}, {$push: {notifications: notification._id}})
    }



    return Response.json({success: 'You liked this post'}, {status: 200})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};

export const DELETE = async (request:Request) => {
  await connectToMongoDB();
  const { postId } = await request.json();
  
  try {
    const currentUser = await getCurrentUserRawData();

    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    await Likes.deleteMany({user: currentUser._id, post: postId})

    await Post.findOneAndUpdate({_id: postId}, {$pull: {likes: currentUser._id}})
    await User.findOneAndUpdate({_id: currentUser._id}, {$pull: {likes: postId}})
    
    return Response.json({success: 'You no longer like the post'}, {status: 200})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};