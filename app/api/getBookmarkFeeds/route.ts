import { getCurrentUser } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Bookmarks from "@/models/bookmarks";
import Media from "@/models/media";
import Post from "@/models/posts";
import User from "@/models/users";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectToMongoDB();

  try {
    const value = request.nextUrl.searchParams.get('page') || undefined;
    const page = parseInt(value as string);
    const pageSize = 10;
    
    const currentUser = await getCurrentUser();


    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    }

    const allBookmarks = await Bookmarks.find({user: currentUser._id})
    .select('post')
    .sort({createdAt: 'descending'});

    const allBookmarkPostIds = JSON.parse(JSON.stringify(allBookmarks)).map((i: { post: string; }) => i.post)

    const bookmarks = await Post.find({_id: {$in: allBookmarkPostIds}})
    .populate('author', '_id username displayName image followers following city state')
    .populate('attachments', '_id url type')
    // .populate({
    //   path: 'comments',
    //   populate: [
    //     {
    //       path: 'author',
    //       select: '_id image displayName username followers following'
    //     }
    //   ]
    // })
    .skip((page - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = bookmarks.length > pageSize ? page + 1 : undefined;

    const data = {
      posts: bookmarks.slice(0, pageSize),
      nextPage: nextPage
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error, try again later'}, {status: 500});
  }
};