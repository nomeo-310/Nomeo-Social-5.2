'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb"
import { createCommentSchema } from "@/lib/validation"
import Comments from "@/models/comments"
import Notifications from "@/models/notifications"
import Post from "@/models/posts"
import User from "@/models/users"

type createCommentProps = {
  postId: string
  content: string
};

export const createComment = async ({postId, content}:createCommentProps) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();  
  if (!currentUser) throw new Error('Unathourized')
  
  const post = await Post.findOne({_id: postId})
  if (!post) throw new Error('Post not found')

  const { content: validatedContent } = createCommentSchema.parse({content})

  const commentData = {
    content: validatedContent,
    post: postId,
    author: currentUser._id
  };

  const comment = await Comments.create(commentData)
  comment.save();


  await Post.findOneAndUpdate({_id: post._id}, {$push: {comments: comment._id}})

  const createdComment = await Comments.findOne({_id: comment._id})
  .populate({
    path: 'author',
    model: User,
    select: '_id username displayName image followers following city'
  })

  if (post.hideNotification === false && JSON.stringify(post.author) !== JSON.stringify(currentUser._id)) {
    const notificationData = {
      issuer: currentUser._id,
      recipient: post.author,
      post: postId,
      type: 'comment-post'
    };

    const newNotification = await Notifications.create(notificationData)
    newNotification.save();

    await User.findOneAndUpdate({_id: post.author}, {$push: {notifications: newNotification._id}})
  }

  const newComment = JSON.parse(JSON.stringify(createdComment))

  return newComment;
};

export const getSingleComment = async (commentId:string) => {

  const currentUser = await getCurrentUserRawData();  
  if (!currentUser) throw new Error('Unathourized')
  
  const comment = await Comments.findOne({_id: commentId})
  .populate({
    path: 'author',
    model: User,
    select: '_id username displayName image followers following city'
  })

  if (!comment) throw new Error('Comment not found')

  const returnedComment = JSON.parse(JSON.stringify(comment))

  return returnedComment;
};

export const deleteComment = async (commentId:string) => {
  const currentUser = await getCurrentUserRawData();  
  if (!currentUser) throw new Error('Unathourized')
  
  const comment = await Comments.findOne({_id: commentId})
  if (!comment) throw new Error('Comment not found')

  if (JSON.stringify(comment.author) !== JSON.stringify(currentUser._id)) throw Error('Unathourized');

  await Post.findOneAndUpdate({_id: comment.post}, {$pull: {comments: comment._id}})
  await Comments.deleteOne({_id: comment._id})

  return {success: 'Comment successfully deleted'};
};