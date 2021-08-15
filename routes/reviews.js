const express = require('express');
const router = express.Router({mergeParams:true});
const catchAsync = require('../utils/cathAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviewSchema = require('../schemas2')
const {validateReview , isLoggedin , isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews');




router.delete('/:reviewId', isLoggedin,isReviewAuthor, catchAsync(reviews.deleteReview))
router.post('/', isLoggedin , validateReview ,catchAsync(reviews.createReview))
module.exports = router;
