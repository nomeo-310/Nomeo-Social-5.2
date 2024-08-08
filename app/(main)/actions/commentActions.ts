'use server'

import { getCurrentUserRawData } from "@/lib/authAction"
import { connectToMongoDB } from "@/lib/connectToMongoDb"
import { createCommentSchema } from "@/lib/validation"
import Comments from "@/models/comments"
import Post from "@/models/posts"

type createCommentProps = {
  postId: string
  content: string
};

export const createComment = async ({postId, content}:createCommentProps) => {
  await connectToMongoDB();

  const currentUser = await getCurrentUserRawData();  
  if (!currentUser) throw new Error('Unathourized')
  
  const post = await Post.findOne({_id: postId})
  if (!post) throw new Error('Unathourized')

  const { content: validatedContent } = createCommentSchema.parse({content})

  const commentData = {
    content: validatedContent,
    post: postId,
    author: currentUser._id
  };

  const comment = await Comments.create(commentData)
  comment.save();

  await Post.findOneAndUpdate({_id: post._id}, {$push: {comments: comment._id}})

  const newComment = JSON.parse(JSON.stringify(comment))

  return newComment;
}