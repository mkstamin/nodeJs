const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');

const app = express();

// GLOBAL MIDDELWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 3,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requet from this IP, please try in an hour!',
});
app.use('/api', limiter);

app.use(express.json());
// app.use(express.static(`${__dirname}/public`, { index: 'home.html' }));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// For all the Routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can not find ${req.originalUrl} on this server`, 404));
});

// Gobal err
app.use(globalErrorHandler);

// START SERVER
module.exports = app;
