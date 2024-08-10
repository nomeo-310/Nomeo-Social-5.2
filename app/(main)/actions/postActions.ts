'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb";
import { createPostSchema } from "@/lib/validation";
import Media from "@/models/media";
import Notifications from "@/models/notifications";
import Post from "@/models/posts";
import User from "@/models/users";
import { postProps } from "@/types/types";

export const createNewPost = async (input: {content: string, attachmentIds: string[]}) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const { content, attachmentIds } = createPostSchema.parse(input);

  const postData = {content: content, author: currentUser._id, attachments: attachmentIds};

  try {
    const post = await Post.create(postData);
    post.save();

    await User.findOneAndUpdate({_id: currentUser._id}, {$push: {posts: post._id}})

    await Media.updateMany({_id: {$in: attachmentIds}}, {post: post._id, author: currentUser._id})

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
  .populate('author', '_id username displayName image followers following bio city state country occupation')
  .populate('attachments', '_id url type')

  if (!post) throw Error('Post not found')

  const postReturned = JSON.parse(JSON.stringify(post));

  return postReturned;
};

export const deletePost = async (id: string) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();

  if (!currentUser) throw Error('Unathourized');

  const post = await Post.findOne({_id: id});

  if (!post) throw Error('Post not found');

  if (JSON.stringify(post.author) !== JSON.stringify(currentUser._id)) throw Error('Unathourized');

  await Media.updateMany({_id: {$in: post.attachments}}, { $unset: { post: "", author: "" }})

  await Notifications.deleteMany({post: id})

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