import mongoose, {Schema} from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

const CompanySchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, 'Name can\'t be empty']
  },
  description:{
    type: String,
    required: [true, 'Text can\'t be empty']
  },
  logo: {
    type: String,
    default: null,
  },
  websiteURL: {
    type: String,
    required: [true, 'Website URL can\'t be empty']
  },
  linkedinURL: {
    type: String,
  },
  hq:{
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  countries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Country'
    }
  ],
  group:{
    type: String,
    enum: ['HIRING','INTERVIEW','MAN IN THE MIDDLE', 'PARTNER'],
    default: 'HIRING'
  },
  createdAt:{
    type: Date,
    unique: true
  }
});

CompanySchema.pre('save', async function () {
  this.createdAt = new Date().toISOString();
});

export default mongoose.model("Company", CompanySchema);