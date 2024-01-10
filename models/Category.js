import mongoose, {Schema} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const CategorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Name can\'t be empty']
  },
  user_id:[{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt:{
    type: Date,
    unique: true
  }
});

CategorySchema.pre('save', async function () {
  this.createdAt = new Date().toISOString();
});

export default mongoose.model("Category", CategorySchema);