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

router
    .route('/')
    .get(protect, getAllReviews)
    .post(protect, restricTo('user'), setTourUserIds, createReview);

router
    .route('/:id')
    .get(protect, getReview)
    .patch(protect, updateReview)
    .delete(protect, deleteReview);

module.exports = router;
