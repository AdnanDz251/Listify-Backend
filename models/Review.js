const mongoose = require('mongoose');

require('dotenv').config();

const ReviewSchema = new mongoose.Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    text:{
        type: String,
        required: [true, 'Text can\'t be empty'],
        minlength: 10,
        maxlength: 1000,
    },
    title: {
        type: String,
        required: [true, 'Title can\'t be empty'],
        minlength: 10,
        maxlength: 100,
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

model.exports = mongoose.model("Review", ReviewSchema);