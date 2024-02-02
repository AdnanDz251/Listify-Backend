import mongoose, {Schema} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const CategorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Name can\'t be empty']
  }
});

export default mongoose.model("Category", CategorySchema);