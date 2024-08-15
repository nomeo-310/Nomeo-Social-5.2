import mongoose from "mongoose";
import { Schema } from "mongoose";

const InterestsSchema:Schema = new Schema({
  user: { type: Schema.ObjectId, ref: 'User'},
  interests: [{type: String, default: '' }]
}, {timestamps: true});

(mongoose.models as any) = {};

const Interests = mongoose.model('Interests', InterestsSchema);

export default Interests;