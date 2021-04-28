const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOveviews = catchAsync(async (req, res) => {
    // Get tour data form the collection
    const tours = await Tour.find();

    // Render the template using tour data
    res.status(200).render('overview', {
        taitle: 'All tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    // get the data , for the requesed tour(with review, user)
    const tour = await Tour.findOne({ slug: req.params.slug })
        .populate({
            path: 'reviews',
            fields: 'review rating user',
        })
        .populate({
            path: 'guides',
            select: 'name photo role',
        });

    if (!tour) {
        return next(new AppError('There is no tour with that name', 404));
    }

    res.status(200).render('tour', {
        taitle: tour.name,
        tour,
    });
});

exports.getLoginForm = async (req, res) => {
    res.status(200).render('login', {
        taitle: 'Log into your account',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        taitle: 'Your account',
    });
};

exports.updateUser = catchAsync(async (req, res) => {
    const userUpdate = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).render('account', {
        taitle: 'Your account',
        user: userUpdate,
    });
});
