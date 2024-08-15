import { getCurrentUser } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Attachment from "@/models/attachments";
import Bookmarks from "@/models/bookmarks";
import Post from "@/models/posts";
import User from "@/models/users";

export const POST = async (request:Request) => {
  const { page } = await request.json()
  await connectToMongoDB();

  try {
    const value = page || undefined;
    const pageNumber = parseInt(value as string);
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
    .populate({
      path: 'author',
      model: User,
      select: '_id username displayName image followers following city state'
    })
    .populate({
      path: 'attachments',
      model: Attachment,
      select: '_id url type'
    })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = bookmarks.length > pageSize ? pageNumber + 1 : undefined;

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