const express = require('express');
const {
    bookingController,
    createBooking,
    getAllBookings,
    getBooking,
    updateBooking,
    deleteBooking,
} = require('../controllers/bookingController');
const { protect, restricTo } = require('../controllers/authController');

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', protect, bookingController);

router.use(restricTo('admin', 'lead-guide'));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
