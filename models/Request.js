import mongoose, {Schema} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();


const RequestSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ['option1', 'option2'],
        default: 'option1'
    },
    createdAt:{
        type: Date,
        unique: true
    }
});

RequestSchema.pre('save', async function () {
    this.createdAt = new Date().toISOString();
});

export default mongoose.model("Request", RequestSchema);