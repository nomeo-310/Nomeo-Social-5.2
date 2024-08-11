import { getCurrentUser } from "@/lib/authAction";
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import Post from "@/models/posts";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  await connectToMongoDB();

  try {
    const query = request.nextUrl.searchParams.get('query') || "";
    const value = request.nextUrl.searchParams.get('page') || undefined;

    const queries = query.split(" ")
    const searchQuery = {
      $or: [
        {content: {$regex: query, $options: 'i'}},
        {
          author: {
            $in: [
              {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author_doc'
              }},
              {$unwind: '$author_doc'},
              {$or: [
                {'author_doc.name': {$regex: query, $options: 'i'}},
                {'author_doc.username': {$regex: query, $options: 'i'}},
                {'author_doc.displayName': {$regex: query, $options: 'i'}}
              ]}
            ]
          }
        },
        {content: {$regex: queries[0], $options: 'i'}},
        {
          author: {
            $in: [
              {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author_doc'
              }},
              {$unwind: '$author_doc'},
              {$or: [
                {'author_doc.name': {$regex: queries[0], $options: 'i'}},
                {'author_doc.username': {$regex: queries[0], $options: 'i'}},
                {'author_doc.displayName': {$regex: queries[0], $options: 'i'}}
              ]}
            ]
          }
        },
        {content: {$regex: queries[1], $options: 'i'}},
        {
          author: {
            $in: [
              {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author_doc'
              }},
              {$unwind: '$author_doc'},
              {$or: [
                {'author_doc.name': {$regex: queries[1], $options: 'i'}},
                {'author_doc.username': {$regex: queries[1], $options: 'i'}},
                {'author_doc.displayName': {$regex: queries[1], $options: 'i'}}
              ]}
            ]
          }
        },
      ]
    };

    const page = parseInt(value as string);
    const pageSize = 10;
    
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return Response.json({error: 'Unathourized'}, {status: 401})
    };

    const posts = await Post.find(searchQuery)
    .populate('author', '_id username displayName image followers following city state')
    .populate('attachments', '_id url type')
    .sort({createdAt: 'descending'})
    .skip((page - 1) * pageSize)
    .limit(pageSize + 1);

    const nextPage = posts.length > pageSize ? page + 1 : undefined;

    const data = {
      posts: posts.slice(0, pageSize),
      nextPage: nextPage
    };

    return Response.json(data);
  } catch (error) {
    console.error(error)
    return Response.json({error: 'Internal server error'}, {status: 500})
  }
}
