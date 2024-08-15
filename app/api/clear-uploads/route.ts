import { connectToMongoDB } from "@/lib/connectToMongoDb"
import Attachment from "@/models/attachments";
import { UTApi } from "uploadthing/server";

export const GET = async (request:Request) => {
  await connectToMongoDB();

  try {
    const authHeaders = request.headers.get("Authorization")

    if (authHeaders !== `Bearer ${process.env.CRON_SECRET}`) {
      return Response.json({error: 'Invalid authorization header'}, {status: 401})
    }

    const isProdution = process.env.NODE_ENV === 'production';

    let searchQuery;

    if (isProdution) {
      searchQuery = {post: undefined || null, createdAt : {$lte: new Date(Date.now() - 1000 * 60* 60 * 24)}}
    } else {
      searchQuery = {post: undefined || null}
    }

    const unusedMedia = await Attachment.find(searchQuery)
    .select('_id url')

    const returnedUnuseMedia = JSON.parse(JSON.stringify(unusedMedia));

    new UTApi().deleteFiles(
      returnedUnuseMedia.map((m: { url: string; }) => m.url.split(`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`)[1])
    );

    await Attachment.deleteMany({_id: {$in: returnedUnuseMedia.map((m: {_id: string}) => m._id)}})

    return new Response();
    
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500})
  }
}