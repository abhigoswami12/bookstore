var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require('path');
var auth = require('../middlewares/auth');
var Book = require('../models/Book');
var User = require('../models/User');
var Review = require('../models/Review');
var Cart = require('../models/Cart');

var bookImgPath = path.join(__dirname, "../" + "public/images/books")

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

//implementing multer diskStorage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, bookImgPath)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-"+ file.originalname);
    }
})

var upload = multer({ storage: storage })

//get all books
router.get('/', (req, res, next) => {
    var warn = req.flash('warn')[0];
    Book.find({}, (err, books) => {
        res.render('listBooks', {books, warn})
    })
})
//go to dashboard
router.get('/dashboard', auth.verifyAdminLogin, async (req, res, next) => {
    var users = await User.find();
    console.log(users)
    res.render('usersList', { users });
})
//block a user 
router.get('/dashboard/:userId/block', auth.verifyAdminLogin, async (req, res, next) => {
    console.log(req.params.userId);
    var userId = req.params.userId;
    var user = await User.findOne({ _id: userId });
    if(!user.isBlocked) {
        user.isBlocked = true;
        user.save();
    } else {
        user.isBlocked = false;
        user.save();
    }
    console.log(user)
    res.redirect('/admin/dashboard');
})

//read single book
router.get('/books/:id', async (req, res, next) => {
    try {
        var warn = req.flash('warn')[0];
        var bookId = req.params.id;
        var book = await Book.findById(bookId).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).exec();
        // console.log("BOOK", book.reviews[0]);
        var cart = await Cart.findById(req.user.cartId);
        res.render('singleBook', { book, cart, warn });

    } catch (error) {
        next(error)
    }

})


//create book
router.get('/new',auth.verifyAdminLogin, (req, res, next) => {
        res.render("createBook");
        req.flash('warn', "you should be the admin to create a book")
})
router.post('/new', auth.verifyAdminLogin, upload.single('avatar'), async(req, res, next) => {
    if(req.file && req.file.filename) {
        req.body.image = req.file.filename;
    }
    req.body.category = req.body.category.split(",").map(categ => categ.trim())
    console.log(req.body)
    
    try {
            var book = await Book.create(req.body);
            res.redirect('/admin');
    } catch (error) {
        next(error);
    }
})

//edit book
router.get('/:id/edit',auth.verifyAdminLogin, async (req, res, next) => {
    var bookId = req.params.id;
    try {
        var book = await Book.findById(req.params.id);
        console.log("book",book)
        res.render('editBook', { book });
        
    } catch (error) {
        next(error);
    }
});

router.post('/:id/edit',auth.verifyAdminLogin, upload.single('avatar'), async(req, res, next) => {
    var bookId = req.params.id;
    if(req.file && req.file.filename) {
        req.body.image = req.file.filename;
    }
    try {
        var book = await Book.findByIdAndUpdate(bookId, req.body);
        res.redirect('/admin');
    } catch (error) {
        next(error);
    }
})

//delete book
router.get('/:id/delete', auth.verifyAdminLogin, async (req, res, next) => {
    var bookId = req.params.id;
    try {
        var book = await Book.findByIdAndDelete(bookId);
        // console.log("book", book);
        await Review.deleteMany({bookId: book._id});
        // var user = await User.findById(req.user.id);
        // console.log("user", user);
        // var cart = await Cart.findById(user.cartId);
        // console.log("cart",cart);
        res.redirect('/admin');
    } catch (error) {
        next(error);
    }
})



module.exports = router;