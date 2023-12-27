const mongoose = require('mongoose');

require('dotenv').config();

const CountrySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name can\'t be empty']
    },
    short:{
        type: String,
    }
});

model.exports = mongoose.model("Country", CountrySchema);