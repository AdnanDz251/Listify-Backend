import mongoose, {Schema} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const ReviewSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId:{
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    text:{
        type: String,
        required: [true, 'Text can\'t be empty'],
        minlength: 10,
        maxlength: 1000,
    },
    rating: {
        type: Number,
        required: [true, 'Title can\'t be empty'],
        minlength: 1,
        maxv: 5,
    },
    createdAt:{
        type: Date,
        unique: true
    }
});

ReviewSchema.pre('save', async function () {
    this.createdAt = new Date().toISOString();
});

export default mongoose.model("Review", ReviewSchema);