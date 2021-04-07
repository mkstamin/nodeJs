class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;

        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // need expalin

        Error.captureStackTrace(this, this.constructor); // need explain
    }
}

module.exports = AppError;
