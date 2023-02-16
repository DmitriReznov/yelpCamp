const express = require('express');
const router = express.Router({mergeParams: true});

const catchAsync = require('../utils/catchAsync');

const {isLoggedIn,validateReview,isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/',isLoggedIn, validateReview,catchAsync(reviews.newReview));

router.delete('/:reviewid',isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;