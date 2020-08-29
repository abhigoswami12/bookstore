var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Review = require('../models/Review');
var User = require('../models/User');
var auth = require('../middlewares/auth');
var Cart = require('../models/Cart');


//read single book
router.get('/:id', async (req, res, next) => {
    // console.log(req.user)
    try {
        var warn = req.flash('warn')[0];
        var bookId = req.params.id;
        var book = await Book.findById(bookId).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).exec();
        if(req.user) {
            var cart = await Cart.findById(req.user.cartId);

        }
        // console.log('cart', cart)
        // console.log("BOOK",book.reviews[0]);
    
        res.render('singleBook', { book, cart, warn });
        
    } catch (error) {
        next(error)
    }
    
})

//create reviews
router.post('/:bookId/review', async (req, res, next) => {
    var bookId = req.params.bookId;
    
    if(req.user === null) {
        req.flash("warn", `*Warning!! You First Need to Login to Access "Reviews"!!`);
        return res.redirect(`/books/${bookId}`);
    }
    try {
        req.body.author = req.user._id;
        req.body.bookId = bookId;
        var review = await Review.create(req.body);
        console.log("review", review)
        var book = await Book.findByIdAndUpdate(bookId, { $push: { reviews: review._id }});
        res.redirect(`/books/${bookId}`);
    } catch (error) {
        next(error);
    }
})





module.exports = router;