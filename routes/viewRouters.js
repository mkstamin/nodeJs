const express = require('express');
const {
    getOveviews,
    getTour,
    signUpForm,
    getLoginForm,
    getAccount,
    updateUser,
    getMyTours,
} = require('../controllers/viewController');
const { isLogedIn, protect } = require('../controllers/authController');
const { createBookingCheckout } = require('../controllers/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isLogedIn, getOveviews);
router.get('/tour/:slug', isLogedIn, getTour);
router.get('/signUp', signUpForm);
router.get('/login', isLogedIn, getLoginForm);

router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUser);

module.exports = router;
