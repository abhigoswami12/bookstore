var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
var Book = require('../models/Book');


//get all books
// router.get('/', async (req, res, next) => {
//     res.send("hi");
//     var warn = req.flash('warn')[0];
//     try {
//         var books = await Book.find();
//         console.log("BOOKs",books)
//         res.render('listBooks', { books })
//     } catch (error) {
//         next(error);
//     }
// })
router.get('/', (req, res, next) => {
    var warn = req.flash('warn')[0];
    Book.find({}, (err, books) => {
        res.render('listBooks', {books, warn})
    })
})

//create book
router.get('/new',auth.verifyUserLogin, (req, res, next) => {
    if(req.user.isAdmin) {
        res.render("createBook");
    } else {
        req.flash('warn', "you should be the admin to create a book")
    }
})
router.post('/new', auth.verifyUserLogin, async(req, res, next) => {
    try {
        if (req.user.isAdmin) {
            console.log(req.body);
            var book = await Book.create(req.body);
            res.redirect('/admin');
        } else {
            req.flash('warn', "you should be the admin to create a book")
        }
        
    } catch (error) {
        next(error);
    }
})



module.exports = router;