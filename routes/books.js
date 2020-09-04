var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Review = require('../models/Review');
var User = require('../models/User');
var auth = require('../middlewares/auth');
var Cart = require('../models/Cart');

//read all favourties
router.get('/favourites',auth.verifyUserLogin, async (req, res, next) => {
    try {
       var user =  await User.findOne({_id: req.user.id})
       console.log(user)
        var favouritesList = await Book.find({_id: { $in: user.favourites }});
        if (req.user) {
            var user = await User.findById(req.user._id).populate('cartId').exec();

        }
        res.render('listFavourites', { favouritesList, user });
    } catch (error) {
        next(error);
    }
})


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
        if (req.user) {
            var user = await User.findById(req.user._id).populate('cartId').exec();

        }
    
        res.render('singleBook', { book, cart, warn, user });
        
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

//favourites
router.get('/:bookId/favourite',auth.verifyUserLogin, async (req, res, next) => {
    let bookId = req.params.bookId;
    console.log(bookId);
    try {
        var book = await Book.findById(bookId);
        // console.log(book);
        var user = await User.findById(req.user.id);
        // console.log(user)
        if(!user.favourites.includes(bookId)) {
            user.favourites.push(bookId);
            // console.log(user);
            user.save();
        } else {
            user.favourites.pull(bookId);
            // console.log(user);
            user.save();
        }
        res.redirect('/');
    } catch (error) {
        next(error);
    }

})

//unfavourite in listFavourites ejs
router.get('/:bookId/unfavourite', auth.verifyUserLogin, async (req, res, next) => {
    let bookId = req.params.bookId;
    console.log(bookId);
    try {
        var book = await Book.findById(bookId);
        // console.log(book);
        var user = await User.findById(req.user.id);
        // console.log(user)
        
            user.favourites.pull(bookId);

            // console.log(user);
            user.save();
            res.redirect('/books/favourites');
    } catch (error) {
        next(error);
    }
})





module.exports = router;