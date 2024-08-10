import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb"
import Followers from "@/models/followers";
import Notifications from "@/models/notifications";
import User from "@/models/users";

export const GET = async (request: Request) => {
  await connectToMongoDB();
  const { userId } = await request.json();

  try {

    const currentUser = await getCurrentUserRawData();
  
    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    const user = await User.findOne({_id: userId})

    if (!user) {
      return Response.json({error: 'User not found'}, {status: 404})
    };

    const userFollowers = await Followers.countDocuments({following: userId});
    const followers = await Followers.find({following: userId, follower: currentUser._id})

    const data = {
      followers: userFollowers,
      isFollowedBy: !!followers.length
    };

    return Response.json(data)
    
  } catch (error) {
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
};

export const POST = async (request: Request) => {
  await connectToMongoDB();

  const { userId } = await request.json();

  try {
    const currentUser = await getCurrentUserRawData();
  
    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    const followData = {
      follower: currentUser._id,
      following: userId
    }

    const follow = await Followers.create(followData)
    follow.save();

    await User.findOneAndUpdate({_id: currentUser._id}, {$push: {following: userId}})
    await User.findOneAndUpdate({_id: userId}, {$push: {followers: currentUser._id}})

    const notificationData = {
      issuer: currentUser._id,
      recipient: userId,
      type: 'user-followed'
    };

    const notification = await Notifications.create(notificationData)
    notification.save();

    await User.findOneAndUpdate({_id: userId}, {$push: {notifications: notification._id}})

    return Response.json({success: 'You are now following user'}, {status: 200})
  } catch (error) {
    return Response.json({error: 'Internal server error'}, {status: 500})
  }
};

export const DELETE = async (request: Request) => {
  await connectToMongoDB();
  const { userId } = await request.json();

  try {
    const currentUser = await getCurrentUserRawData();
  
    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    await Followers.deleteMany({following: userId, follower: currentUser._id})

    await User.findOneAndUpdate({_id: currentUser._id}, {$pull: {following: userId}})
    await User.findOneAndUpdate({_id: userId}, {$pull: {followers: currentUser._id}})

    return Response.json({success: 'You are no longer following user'}, {status: 200})
  } catch (error) {
    return Response.json({error: 'Internal server error'}, {status: 500})
  }
};