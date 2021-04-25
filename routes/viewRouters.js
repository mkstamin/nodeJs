const express = require('express');
const { getOveviews, getTour } = require('../controllers/viewController');

const router = express.Router();

router.get('/', getOveviews);
router.get('/tour/:slug', getTour);

module.exports = router;
