const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    // remove password from the output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

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

    const url = `${req.protocol}://${req.get('host')}/me`;

    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
    try {
        // Get the the  token if it is exists
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            [, token] = req.headers.authorization.split(' ');
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('You are not logged in!! Please log in to get access', 401));
        }
        // verification token

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if user still exists
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return next(new AppError('The user belonging to this token is no longor exist', 401));
        }
        // Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        }

        // geant access to protected route
        req.user = currentUser;
        res.locals.user = currentUser;

        return next();
    } catch (err) {
        return next();
    }
};

exports.isLogedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            // Check if user still exists
            const currentUser = await User.findById(decoded.id);

            if (!currentUser) {
                return next();
            }
            // Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // There is a loged in user
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

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

    // send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forget your password ? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nif you did not forget your password, please ignor this email`;

    try {
        // await sendEmail({
        //     email: user.email,
        //     subject: 'you password reset token (valid for 10 min',
        //     message,
        // });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try amin later!', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // Get the user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }, // কেমন করে এইটা বড় হয়
    });

    // If token has not expired, and has user then reset the password
    if (!user) {
        return next(new AppError('Token is invalid or expired!', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Log in the user in, send JWT
    createSendToken(user, 200, res);
    // const token = signToken(user._id);

    // res.status(201).json({
    //     status: 'success',
    //     token,
    // });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
    // Get user from the collection
    const user = await User.findById(req.user.id).select('+password');
    // findById এই ফাংশনে প্রব্লেম হইতে পারে
    // post save middleware make করা যেতে পারে

    // Check id the Posted current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        // const token = signToken(user._id);
        // res.json({ token });
        return next(new AppError('Your current password is wrong!', 401));
    }

    // if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // Log user in , send JWT
    createSendToken(user, 200, res);
});
