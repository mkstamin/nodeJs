const express = require('express');
const { protect, restricTo } = require('../controllers/authController');
const {
    getMonthlyPlan,
    getTourStats,
    aliseTopCheap,
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    getToursWithin,
} = require('../controllers/tourControllers');

const reviewRouter = require('./reviewRouters');

const router = express.Router();

// marge review router
router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(aliseTopCheap, getAllTours);
router.route('/tour-stats').get(getTourStats);

router
    .route('/monthly-plan/:year')
    .get(protect, restricTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router.route('/').get(getAllTours).post(protect, restricTo('admin', 'lead-guide'), createTour);

router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(getToursWithin);

router
    .route('/:id')
    .get(getTour)
    .patch(protect, restricTo('admin', 'lead-guide'), updateTour)
    .delete(protect, restricTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
