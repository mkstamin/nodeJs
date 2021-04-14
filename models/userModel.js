const crypto = require('crypto');
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
    role: {
        type: String,
        enum: ['user', 'guid', 'lead-guide', 'admin'],
        default: 'user',
    },
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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExperies: Date,
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

useSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = (this.passwordChangedAt.getTime() / 1000) * 1;

        // console.log(changedTimestamp, JWTTimestamp);

        return JWTTimestamp < changedTimestamp;
    }
    // false means not changed
    return false;
};

useSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExperies = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', useSchema);

module.exports = User;
