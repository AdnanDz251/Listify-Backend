const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail,
            message: 'Valid email required'
        },
        unique: true 
    },
    password: {
        type: String,
        required: [true, 'Password can\'t be empty'],
        validate: {
            validator: validator.isStrongPassword,
            message: 'Valid password'
        },
        select: false
    },
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

UserSchema.methods.createJWT = function () {
    return jwt.sign({ 'user_id': this._id, 
                        'name': this.name, 
                        'surname': this.surname, 
                        'email':this.email, 
                        'isActive': this.isActive,
                        'isAdmin': this.isAdmin,
                        'isAdmitted': this.isAdmitted }, process.env.JWT_SECRET);
};

UserSchema.methods.comparePassword = async function (pass) {
    return await bcryptjs.compare(pass, this.password);
};

module.exports = mongoose.model("User", UserSchema);