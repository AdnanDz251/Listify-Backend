import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Timestamp } from 'mongodb';

dotenv.config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: null,
    },
    email:{
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email Not Valid'
        },
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'Password can\'t be empty'],
        validate: {
            validator: validator.isStrongPassword,
            message: 'Password Not Valid'
        },
        select: false
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    joinedAt: {
        type: Date,
        default: null
    },
    categories: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Category'
        }
    ],
    isActive: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAdmitted: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        unique: true
    }
});

UserSchema.pre('save', async function () {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    this.createdAt = new Date().toISOString();
});

UserSchema.statics.updatePassword = async function(user_id, newPassword) {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    return this.updateOne({ _id: user_id }, { password: hashedPassword });
};

UserSchema.methods.createJWT = function () {
    return jwt.sign({ 'user_id': this._id, 
                        'name': this.name, 
                        'surname': this.surname, 
                        'email':this.email, 
                        'isActive': this.isActive,
                        'isAdmin': this.isAdmin,
                        'isAdmitted': this.isAdmitted,
                        'company': this.company, 
                        'isBanned': this.isBanned,
                        'joinedAt': this.joinedAt }, 
                        process.env.JWT_SECRET,
                        { expiresIn: '4h' }
                    );
};

UserSchema.methods.comparePassword = async function (pass) {
    return await bcryptjs.compare(pass, this.password);
};

export default mongoose.model("User", UserSchema);