const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

exports.signup = catchAsync(async (req, res, next) => {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser,
        },
    });
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password'));
    }
    // Check if user exists && password is correct
    // const user = await User.findOne({ email }).select('+password +name');
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // If everything ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token,
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    // Get the the  token if it is exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        [, token] = req.headers.authorization.split(' ');
    }

    if (!token) {
        return next(new AppError('You are not logged in!! Please log in to get access', 401));
    }
    // verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new AppError('The user belonging to this token is no longor exist', 401));
    }
    // Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // geant access to protected route
    req.user = freshUser;

    next();
});

exports.restricTo = (...roles) => (req, res, next) => {
    // roles ['admin','user']
    if (!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to doing this action', 403));
    }

    next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // get user based on the posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('There is no user with this email address', 404));
    }
    // generate the random reset token
    const resetToken = user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });
});

exports.resetPassword = (req, res, next) => {};
