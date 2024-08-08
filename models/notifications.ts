import mongoose from "mongoose";
import { Schema } from "mongoose";

const NotificationsSchema:Schema = new Schema({
  createdBy: { type: Schema.ObjectId, ref: 'User'},
  notificationFor: { type: Schema.ObjectId, ref: 'User'},
  post: { type: Schema.ObjectId, ref: 'Post'},
  comment: {type: Schema.ObjectId, ref: 'Comments'},
  type: { type: String, enum: ['like-post', 'report-post', 'barred-post', 'comment-post']},
}, {timestamps: true});

(mongoose.models as any) = {};

const Notifications = mongoose.model('Notifications', NotificationsSchema);

export default Notifications;