import { getCurrentUserRawData } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import streamServerClient from "@/lib/stream";

export const GET = async () => {
  await connectToMongoDB();

  try {
    const currentUser = await getCurrentUserRawData();
    
    if (!currentUser) {
      return Response.json({error: 'Unathorized'}, {status: 401})
    };

    console.log('Calling get-token for user', JSON.stringify(currentUser._id))

    const expirationTime = Math.floor(Date.now()/ 1000) + 60 * 60;
    const issuedAt = Math.floor(Date.now()/ 1000) - 60;

    const token = streamServerClient.createToken(
      JSON.stringify(currentUser._id),
      expirationTime,
      issuedAt,
    );

    return Response.json({token})
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500});
  }
}