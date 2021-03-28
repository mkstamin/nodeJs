const express = require('express');
const {
    checkId,
    checkBody,
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
} = require('../controllers/tourControllers');

const router = express.Router();

router.param('id', checkId);

router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
