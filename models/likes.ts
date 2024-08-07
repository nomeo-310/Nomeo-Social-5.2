import mongoose from "mongoose";
import { Schema } from "mongoose";

const LikesSchema:Schema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User'},
  post: { type: Schema.ObjectId, ref: 'Post'}
}, {timestamps: true});

(mongoose.models as any) = {};

const Likes = mongoose.model('Likes', LikesSchema);

export default Likes;