import mongoose from "mongoose";
import { Schema } from "mongoose";

const FollowersSchema:Schema = new Schema({
  follower: { type: Schema.ObjectId, ref: 'User'},
  following: { type: Schema.ObjectId, ref: 'User'}
}, {timestamps: true});

(mongoose.models as any) = {};

const Followers = mongoose.model('Followers', FollowersSchema);

export default Followers;