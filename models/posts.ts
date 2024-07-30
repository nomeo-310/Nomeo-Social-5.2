import mongoose from 'mongoose';
import {  Schema } from 'mongoose';


const PostSchema:Schema = new Schema({
  content: { type: String, default: '' },
  images: [{ type: Schema.ObjectId, ref: 'Media'}],
  author: { type: Schema.ObjectId, ref: 'User'},
  likes: [{ type: Schema.ObjectId, ref: 'User'}],
  bookmarks: [{ type: Schema.ObjectId, ref: 'User'}],
  hideNotification: { type: Boolean, default: false },
  isBarred: { type: Boolean, default: false },
  hidePost: { type: Boolean, default: false },
  postReported: { type: Boolean, default: false },
  totalReports: { type: Number, default: 0 },
  comments: [{ type: Schema.ObjectId, ref: 'Comment'}],
}, {timestamps: true}); 


(mongoose.models as any) = {};

const Post = mongoose.model('Post', PostSchema);

export default Post;