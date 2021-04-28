const express = require('express');
const {
    getOveviews,
    getTour,
    getLoginForm,
    getAccount,
    updateUser,
} = require('../controllers/viewController');
const { isLogedIn, protect } = require('../controllers/authController');

const router = express.Router();

router.get('/', isLogedIn, getOveviews);
router.get('/tour/:slug', isLogedIn, getTour);
router.get('/login', isLogedIn, getLoginForm);
router.get('/me', protect, getAccount);

router.post('/submit-user-data', protect, updateUser);

module.exports = router;
