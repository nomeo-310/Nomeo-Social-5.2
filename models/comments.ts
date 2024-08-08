import mongoose from "mongoose";
import { Schema } from "mongoose";

const CommentsSchema:Schema = new Schema({
  author: { type: Schema.ObjectId, ref: 'User'},
  post: { type: Schema.ObjectId, ref: 'Post'},
  content: { type: String, default: ''},
}, {timestamps: true});

(mongoose.models as any) = {};

const Comments = mongoose.model('Comments', CommentsSchema);

export default Comments;