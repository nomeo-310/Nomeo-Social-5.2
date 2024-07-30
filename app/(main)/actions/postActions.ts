'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { createPostSchema } from "@/lib/validation";
import Post from "@/models/posts";
import { postProps } from "@/types/types";

export const createNewPost = async (input: string) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const { content } = createPostSchema.parse({content: input});

  const postData = {content: content, author: currentUser.id};

  try {
    const post = await Post.create(postData);
    post.save();

    return {success: 'Post successfully created'} 
  } catch (error) {
    return {error: 'Internal server error, try again later'} 
  }
};

export const getAllPosts = async () => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const postsArray = await Post.find()
  .populate('author', '_id username displayName image')
  .sort({createdAt: 'descending'});

  const posts = JSON.parse(JSON.stringify(postsArray))

  return posts;
};

export const getTrendingTopics = async () => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const postsArray = await Post.find().sort({createdAt: 'descending'});

  const posts:postProps[] = JSON.parse(JSON.stringify(postsArray))

  function countHashtags(posts: postProps[]): { hashtag: string; count: number }[] {
    const hashtagCounts: { [hashtag: string]: number } = {};
  
    posts.forEach(post => {
      const hashtags = extractHashtagsWithSymbol(post.content);
      hashtags.forEach(hashtag => {
        hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
      });
    });
  
    return Object.entries(hashtagCounts).map(([hashtag, count]) => ({ hashtag, count })).sort((a, b) => b.count - a.count);
  }
  
  function extractHashtagsWithSymbol(post: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = post.match(hashtagRegex)?.map(hashtag => hashtag) || [];
    return hashtags.splice(0, 5);
  }

  const hashtagCounts = countHashtags(posts).splice(0, 5);
  console.log(hashtagCounts);
  
  return hashtagCounts;
};
