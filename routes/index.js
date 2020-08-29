var express = require('express');
var router = express.Router();

var passport = require('passport');
var Book = require('../models/Book');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("REQUESTED USER", req.session);
  Book.find({}, (err, books) => {
    if(err) next(err);
    console.log(books)
    res.render('index', { books });
  })
});


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
