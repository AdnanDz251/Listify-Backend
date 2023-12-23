const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URI, {   
})
    .then(() => console.log("Connected to DB"))
    .catch(console.error);