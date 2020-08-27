var express = require('express');
var router = express.Router();

var User = require('../models/User');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//registration

router.get('/register', (req, res, next) => {
  var warn = req.flash('warn')[0];
  console.log(warn)
  res.render('createRegisterForm',{ warn });
})

router.post('/register', async (req, res, next) => {
  console.log('entered')
  console.log("BODY", req.body)

  try {
    var user = await User.create(req.body);
    console.log(user);
    res.redirect('/users/login');
    
  } catch (error) {
    // next(error)
    req.flash('warn', 'All fields are required to be filled')
    return res.redirect('/users/register');
  }
})

//login
router.get('/login', (req, res, next) => {
  var warn = req.flash('warn')[0];
  res.render('createLoginForm', { warn })
})
router.post('/login', async (req, res, next) => {
  var {email, password } = req.body;
  // console.log({password})
  
  try {
    if(!email || !password) {
      req.flash('warn', '*Email and password are required!!')
      return res.redirect('/users/login');
    }
    var user = await User.findOne({ email });
    if(!user) {
      req.flash('warn', '*Email address not registered!! Please enter valid email')
      return res.redirect('/users/login');
    }
    var result = await user.validatePassword(password);
    if(!result) {
      req.flash('warn', '*Password is Wrong');
      return res.redirect('/users/login');
    }
    req.session.userId = user.id;
    return res.redirect('/users');
  } catch (error) {
      next(error);
  }
})

//logout
router.get('/logout', (req, res, next) => {
  console.log('entered')
  req.session.destroy();
  console.log(req.session)
  res.clearCookie('connect-sid');
  res.redirect('/users');
})
module.exports = router;
