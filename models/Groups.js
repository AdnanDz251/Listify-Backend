import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const GroupSchema = new mongoose.Schema({
    name:{
        type: String,
        unique: true
    }
});

export default mongoose.model("Group", GroupSchema);