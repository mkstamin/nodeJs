const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews,
        },
    });
});

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review can not find!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review,
        },
    });
});

exports.createReview = catchAsync(async (req, res, next) => {
    // req এর মধ্যে user টা কই থেকে আসছে?
    // req.user comes from the protect handler
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const review = await Review.create(req.body);

    res.status(201).json({
        status: 'seccess',
        data: {
            review,
        },
    });
});

exports.deleteReview = factory.deleteOne(Review);
