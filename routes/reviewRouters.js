const express = require('express');
const {
    getAllReviews,
    getReview,
    createReview,
    deleteReview,
    updateReview,
    setTourUserIds,
} = require('../controllers/reviewController');
const { protect, restricTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(protect);

router.route('/').get(getAllReviews).post(restricTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(restricTo('user', 'admin'), updateReview)
    .delete(restricTo('user', 'admin'), deleteReview);

module.exports = router;
