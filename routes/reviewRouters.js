const express = require('express');
const {
    getAllReviews,
    getReview,
    createReview,
    deleteReview,
} = require('../controllers/reviewController');
const { protect, restricTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router.route('/').get(protect, getAllReviews).post(protect, restricTo('user'), createReview);
router.route('/:id').get(protect, getReview).delete(protect, deleteReview);

module.exports = router;
