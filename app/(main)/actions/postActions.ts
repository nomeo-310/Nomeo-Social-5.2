'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { createPostSchema } from "@/lib/validation";
import Post from "@/models/posts";
import User from "@/models/users";
import { postProps } from "@/types/types";

export const createNewPost = async (input: string) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const { content } = createPostSchema.parse({content: input});

  const postData = {content: content, author: currentUser._id};

  try {
    const post = await Post.create(postData);
    post.save();

    await User.findOneAndUpdate({_id: currentUser._id}, {$push: {posts: post._id}})

    const newPostValue =  await Post.findOne({_id: post._id})
    .populate('author', '_id username displayName image followers following');

    const newPost = JSON.parse(JSON.stringify(newPostValue));

    return newPost;
  } catch (error) {
    return {error: 'Internal server error, try again later'} 
  }
};

export const getSinglePost = async (id: string) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();
  if (!currentUser) throw Error('Unathourized');

  const post = await Post.findOne({_id: id})
  .populate('author', '_id username displayName image followers following')

  if (!post) throw Error('Post not found')

  const postReturned = JSON.parse(JSON.stringify(post));

  return postReturned;
}

export const deletePost = async (id: string) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const post = await Post.findOne({_id: id});

  if (!post) throw Error('Post not found');

  if (JSON.stringify(post.author) !== JSON.stringify(currentUser._id)) throw Error('Unathourized');

  await Post.deleteOne({_id: id})

  await User.findOneAndUpdate({_id: currentUser._id}, {$pull: {posts: post._id}})

  return {success: 'Post successfully deleted'};
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
  return hashtagCounts;
};
