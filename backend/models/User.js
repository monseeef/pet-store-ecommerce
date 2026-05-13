const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const validator = require('validator'); // Importing validator library
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail, // Using isEmail method from validator for email validation 
            message: 'Please enter a valid email address'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    passwordChangeAt:Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });

userSchema.methods.isValidPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

userSchema.methods.createResetPasswordToken= async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken =crypto.createHash('sha256').update(resetToken).digest('hex');
    
    this.resetPasswordExpire = Date.now()+10*60*1000;//expires in 10 mins
    
    return resetToken;
}

const User = mongoose.model('User', userSchema);

module.exports = User;
