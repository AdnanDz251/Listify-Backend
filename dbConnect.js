import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export default function Connect() {
    mongoose.set('strictQuery', false);

    mongoose.connect(process.env.DB_URI, {   
    })
        .then(() => console.log("Connected to DB"))
        .catch(console.error);
}