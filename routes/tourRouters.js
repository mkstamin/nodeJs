const express = require('express');
const {
    getTourStats,
    aliseTopCheap,
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
} = require('../controllers/tourControllers');

const router = express.Router();

router.route('/top-5-cheap').get(aliseTopCheap, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
