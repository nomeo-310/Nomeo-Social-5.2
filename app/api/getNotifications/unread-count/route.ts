import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Notifications from "@/models/notifications";

export const GET = async () => {
  await connectToMongoDB();

  try {
    const currentUser = await getCurrentUserRawData();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const notificationCount = await Notifications.countDocuments({recipient: currentUser._id, read: false})

    const data = { unreadCounts: notificationCount };

    return Response.json(data);
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'}, {status: 500}); 
  }
};