const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const useSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your valid email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        // This only work on CREATE and SAVE
        validate: {
            validator(el) {
                return el === this.password;
            },
            message: 'Password does not match!',
        },
    },
});

useSchema.pre('save', async function (next) {
    // Only work when the password is modifies
    if (!this.isModified('password')) return next();
    // password was hash with bcrypt
    this.password = await bcrypt.hash(this.password, 12);

    // Remove passwordConfirm
    this.passwordConfirm = undefined;

    next();
});

useSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    const correct = await bcrypt.compare(candidatePassword, userPassword);
    return correct;
};

const User = mongoose.model('User', useSchema);

module.exports = User;
