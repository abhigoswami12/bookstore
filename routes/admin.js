var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require('path');
var auth = require('../middlewares/auth');
var Book = require('../models/Book');

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

//delete article
router.get('/:id/delete', auth.verifyAdminLogin, async (req, res, next) => {
    var bookId = req.params.id;
    try {
        var deletedBook = await Book.findByIdAndDelete(bookId);
        res.redirect('/admin');
    } catch (error) {
        next(error);
    }
})



module.exports = router;