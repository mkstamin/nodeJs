const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouters');
const userRouter = require('./routes/userRouters');

const app = express();

// MIDDELWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json());
// app.use(express.static(`${__dirname}/public`, { index: 'home.html' }));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    console.log('Hello from the middleware ✋');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.requestTime);
    next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// START SERVER
module.exports = app;
