import mongoose, {Schema} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const CountrySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name can\'t be empty']
    },
    short:{
        type: String,
    }
});

export default mongoose.model("Country", CountrySchema);