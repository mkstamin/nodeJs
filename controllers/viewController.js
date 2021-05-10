const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
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

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        taitle: 'Log into your account',
    });
};

exports.signUpForm = (req, res) => {
    res.status(200).render('signup', {
        taitle: 'Create an account',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        taitle: 'Your account',
    });
};
exports.getMyTours = catchAsync(async (req, res, next) => {
    // find all booking
    const booking = await Booking.find({ user: req.user.id });

    // find tours with the returned IDs
    const toursIDs = booking.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: toursIDs } });

    res.status(200).render('overview', {
        taitle: 'My tours',
        isBookingTours: true,
        tours,
    });
});

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
