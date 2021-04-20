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
} = require('../controllers/tourControllers');

const reviewRouter = require('./reviewRouters');

const router = express.Router();

// marge review router
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliseTopCheap, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createTour);
router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(protect, restricTo('admin', 'lead-guide'), deleteTour);
module.exports = router;
