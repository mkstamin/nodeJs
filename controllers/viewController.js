const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOveviews = catchAsync(async (req, res) => {
    // Get tour data form the collection
    const tours = await Tour.find();

    // Render the template using tour data
    res.status(200).render('overview', {
        taitle: 'All tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res) => {
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

    console.log(tour.reviews[0].user.name);

    res.status(200).render('tour', {
        taitle: tour.name,
        tour,
    });
});
