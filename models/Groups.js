const mongoose = require('mongoose');

require('dotenv').config();

const GroupSchema = new mongoose.Schema({
    name:{
        type: String,
    }
});

model.exports = mongoose.model("Group", GroupSchema);