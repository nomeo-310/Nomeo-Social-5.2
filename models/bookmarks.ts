import mongoose from "mongoose";
import { Schema } from "mongoose";

const BookmarksSchema:Schema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User'},
  post: { type: Schema.ObjectId, ref: 'Post'}
}, {timestamps: true});

(mongoose.models as any) = {};

const Bookmarks = mongoose.model('Bookmarks', BookmarksSchema);

export default Bookmarks;