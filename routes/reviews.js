var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Review = require('../models/Review');
var Book = require('../models/Book');

//update reviews
//check if the author of the comment is the logged in user (any othe logged in user should not be able to update others reviews)
router.get('/:reviewId/edit', async (req, res, next) => {
    var reviewId = req.params.reviewId;
    try {
        var review = await Review.findById(reviewId);
        if(review.author.toString() === req.user.id) {
            res.render('editReview', { review })
        } else {
            req.flash('warn', "you must be the author of the review to edit it!!")
            res.redirect(`/books/${review.bookId}`)
        }
        
    } catch (error) {
        next(error);
    }
})

router.post('/:reviewId/edit', async (req, res, next) => {
    var reviewId = req.params.reviewId;
    try {
        var review = await Review.findById(reviewId);
        if(review.author.toString() === req.user.id) {
            review.content = req.body.content;
            review.save();
            res.redirect(`/books/${review.bookId}`)
        } else {
            req.flash('warn', "you must be the author of the review to edit it!!")
            res.redirect(`/books/${review.bookId}`)
        }
    } catch (error) {
        next(error)
    }
})

//delete review
router.get('/:reviewId/delete', async (req, res, next) => {
    var reviewId = req.params.reviewId;
    try {
        var review = await Review.findById(reviewId);
        if(review.author.toString() === req.user.id) {
            await Book.findByIdAndUpdate(review.bookId, { $pull: { reviews: review._id}})
            review.remove();
            res.redirect(`/books/${review.bookId}`);
        } else {
            req.flash('warn', "you must be the author of the review to delete it!!")
            res.redirect(`/books/${review.bookId}`)
        }
    } catch (error) {
        next(error);
    }
})


module.exports = router;