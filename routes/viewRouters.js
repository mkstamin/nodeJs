const express = require('express');
const { getOveviews, getTour, getLoginForm } = require('../controllers/viewController');
const { isLogedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLogedIn);

router.get('/', getOveviews);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;
