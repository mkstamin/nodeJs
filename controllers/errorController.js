const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
};

//  (["'])(?:(?=(\\?))\2.)*?\1
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;

    return new AppError(message, 400);
};

const handleValidatorErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Validate input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token please logain again', 401);
const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please logain again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });

        // Programing or other unknown error: dont leak error details
    } else {
        // Loge error
        console.error('ERROR 🔥', err);
        // Send general message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

module.exports = (error, req, res, next) => {
    let err = error;
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // CastError Handle
        if (err.name === 'CastError') err = handleCastErrorDB(err);
        // Duplicate Fields
        if (err.code === 11000) err = handleDuplicateFieldsDB(err);
        // Validator Error
        if (err.name === 'ValidationError') err = handleValidatorErrorDB(err);

        if (err.name === 'JsonWebTokenError') err = handleJWTError(err);
        if (err.name === 'TokenExpiredError') err = handleJWTExpiredError(err);

        sendErrorProd(err, res);
    }

    next();
};
