import mongoose from "mongoose";
import { Schema } from "mongoose";

export enum notificationTypes {
  like = 'like-post', 
  report = 'report-post', 
  barred = 'barred-post', 
  comment = 'comment-post', 
  follow = 'user-followed'
};

const NotificationsSchema:Schema = new Schema({
  issuer: { type: Schema.ObjectId, ref: 'User'},
  recipient: { type: Schema.ObjectId, ref: 'User'},
  post: { type: Schema.ObjectId, ref: 'Post'},
  comment: {type: Schema.ObjectId, ref: 'Comments'},
  type: { type: String, enum: notificationTypes, default: notificationTypes.like},
  read: { type: Boolean, default: false }
}, {timestamps: true});

(mongoose.models as any) = {};

const Notifications = mongoose.model('Notifications', NotificationsSchema);

export default Notifications;