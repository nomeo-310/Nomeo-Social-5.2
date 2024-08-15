import mongoose from 'mongoose';
import {  Schema } from 'mongoose';


const AttachmentSchema:Schema = new Schema({
  author: { type: Schema.ObjectId, ref: 'User'},
  post: { type: Schema.ObjectId, ref: 'Post'},
  type: { type: String, enum: ['image', 'video']},
  url: { type: String, default: ''}
}, {timestamps: true}); 


(mongoose.models as any) = {};

const Attachment = mongoose.model('Attachment', AttachmentSchema);

export default Attachment;