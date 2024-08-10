import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Notifications from "@/models/notifications";

export const PATCH = async () => {
  await connectToMongoDB();

  try {
    const currentUser = await getCurrentUserRawData();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

   await Notifications.updateMany({recipient: currentUser._id, read: false}, {read: true})

   return Response.json({success: 'All notification has been marked as read'}, {status: 200});
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'}, {status: 500}); 
  }
};