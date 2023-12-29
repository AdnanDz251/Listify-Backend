const mongoose = require('mongoose');

require('dotenv').config();

const CompanySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name can\'t be empty']
    },
    decription:{
        type: String,
        required: [true, 'Text can\'t be empty']
    },
    logo: {
        type: String,
    },
    websiteURL: {
        type: String,
        required: [true, 'Website URL can\'t be empty']
    },
    linkedinURL: {
        type: String,
    },
    ratings: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Review'
        }
      ],
    countries: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Country'
        }
      ],
    isActive: {
      type: Boolean,
      default: false
    },
    group:{
          type: Schema.Types.ObjectId,
          ref: 'Group'
        },
    createdAt:{
        type: Date,
        unique: true
    }
});

CompanySchema.pre('save', async function () {
    this.createdAt = new Date().toISOString();
});

model.exports = mongoose.model("Company", CompanySchema);