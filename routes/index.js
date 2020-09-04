var express = require('express');
var router = express.Router();

var passport = require('passport');
var Book = require('../models/Book');
var User = require('../models/User');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   console.log("REQUESTED USER", req.session);
//   Book.find({}, (err, books) => {
//     if(err) next(err);
//     console.log(books)
//     res.render('index', { books });
//   })
// });

//read all books on home page
router.get('/', async function (req, res, next) {
  var query = {};
  try {
   
    if(req.query.price) {
      if (req.query.price === "low-to-high") {
        var books = await Book.find({}).sort({ price: 1 });
      } else if (req.query.price === "high-to-low") {
        var books = await Book.find({}).sort({ price: -1 });
      } else if (req.query.price === "newest") {
        var books = await Book.find({}).sort({ createdAt: -1 });
      }
    } else {
      if (req.query.author) {
        var name = req.query.author;
        console.log(name)
        query.author = name;
      }
      if (req.query.category) {
        console.log(req.query)
        var category = req.query.category;
        // query.category = category;
        query.category = {$in: category}
        console.log(query)
      }

      var books = await Book.find(query);
    }
    if(req.user) {
      var user = await User.findById(req.user._id).populate('cartId').exec();

    }
    // console.log(user)
    res.render("index", { books, user });

    
  } catch (error) {
      next(error);
  }
});

// router.get('/price-low-to-high', async (req, res, next) => {
//   try {
//     var books = await Book.find({}).sort({ price: 1 })
//     res.render("index", { books });
//   } catch (error) {
//       next(error);
//   }
// });
// router.get('/price-high-to-low', async (req, res, next) => {
//   try {
//     var books = await Book.find({}).sort({ price: -1 })
//     res.render("index", { books });
//   } catch (error) {
//     next(error);
//   }
// })
// router.get("/newest", async (req, res, next) => {
//   try {
//     var books = await Book.find({}).sort({ createdAt: -1 });
//     res.render("index", { books });
//   } catch (error) {
//     next(error);
//   }
// });


//google routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/users/login' }),
  function (req, res) {
    res.redirect('/');
  });


//github routes
router.get('/auth/github',
  passport.authenticate('github'));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/users/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
