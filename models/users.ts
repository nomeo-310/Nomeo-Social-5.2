import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema:Schema = new Schema({
  name: {type: String, default: '' },
  displayName: {type: String, default: '' },
  username: { type: String, require: true, unique:true },
  email: { type: String, require: true, unique:true },
  hashedPassword: { type: String, default: '' },
  image: { type:String, default: ''},
  profileImage: { type: Object, default: { public_id: '', secure_url: '' }},
  occupation: { type: String, default: ''},
  bio: { type: String, default: ''},
  city: { type: String, default: ''},
  state: { type: String, default: ''},
  country: { type: String, default: ''},
  website: { type: String, default: ''},
  posts: [{ type: Schema.ObjectId, ref: 'Post'}],
  followers: [{ type: Schema.ObjectId, ref: 'User'}],
  following: [{ type: Schema.ObjectId, ref: 'User'}],
  likes: [{ type: Schema.ObjectId, ref: 'Post'}],
  comments: [{ type: Schema.ObjectId, ref: 'Comments'}],
  notifications: [{ type: Schema.ObjectId, ref: 'Notifications'}],
  bookmarks : [{ type: Schema.ObjectId, ref: 'Post'}],
}, {timestamps: true});

(mongoose.models as any) = {};

const User = mongoose.model('User', UserSchema);

export default User;