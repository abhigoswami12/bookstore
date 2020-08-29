var express = require('express');
var router = express.Router();
var Cart = require('../models/Cart');
var auth = require('../middlewares/auth')


//get cart list
router.get('/view-cart',auth.verifyUserLogin, async (req, res, next) => {
    try {
        var cart = await Cart.findOne({userId: req.user.id}).populate('booksId').exec();
        // if(cart.booksId.includes())
        // console.log(cart)
        // console.log('CART', cart[4]);
        res.render('viewCart', { cart });

    } catch (error) {
        next(error);
    }
})

//create item in cart
router.get('/:bookId',auth.verifyUserLogin, async (req, res, next) => {
    var bookId = req.params.bookId;
    // console.log(bookId)
    // console.log(req.user.cartId);
    // var cart = await Cart.findByIdAndUpdate(req.user.cartId, { $set: { booksId: bookId }, $inc: { itemsInCart: 1}}, { new: true });
    try {
        var cart = await Cart.findById(req.user.cartId);
        if(!cart.booksId.includes(bookId)) {
            cart.booksId.push(bookId);
            // cart.itemsInCart += 1;
            cart.itemsInCart = cart.booksId.length;
            cart.save();
            res.redirect(`/books/${bookId}`)
        } else {
            cart.booksId.pull(bookId);
            // cart.itemsInCart += 1;
            cart.itemsInCart = cart.booksId.length;
            cart.save();
            res.redirect('/carts/view-cart')
        }
        // console.log("cart", cart);
        
    } catch (error) {
        next(error);
    }
})






module.exports = router;