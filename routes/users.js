var express = require('express');
var router = express.Router();
// var multer = require('multer');
// var path = require('path');
// var profileImgPath = path.join(__dirname, "../" + "public/images/profiles")

var User = require('../models/User');
var auth = require('../middlewares/auth');

//using multer to upload image
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // console.log(file);
//     cb(null, profileImgPath);
//   },
//   filename: function (req, file, cb) {
//     // console.log(file);
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// })

// var upload = multer({ storage: storage })

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//registration

router.get('/register', (req, res, next) => {
  var warn = req.flash('warn')[0];
  res.render('createRegisterForm',{ warn });
})

router.post('/register', async (req, res, next) => {
  // if (req.file && req.file.filename) {
  //   req.body.image = req.file.filename;
  // }
  console.log('entered')
  console.log("BODY", req.body)
  try {
    if(!req.body.name || !req.body.username) {
      req.flash('warn', 'All fields are required to be filled')
      return res.redirect('/users/register');
    }
    var email = req.body.email;
    var username = req.body.username;
    console.log(username);
    var userWithUsername = await User.findOne({ username });
    console.log(userWithUsername);
    if (userWithUsername) {
      req.flash("warn", "username already exists");
      return res.redirect("/users/register");
    }
    var user = await User.findOne({ email });

    if(user) {
      req.flash('warn', 'Email already exists')
      return res.redirect('/users/register');
    }
    await User.create(req.body);
    res.redirect('/users/login');
    
  } catch (error) {
    next(error)
  }
})

//login
router.get('/login', (req, res, next) => {
  var warn = req.flash('warn')[0];
  res.render('createLoginForm', { warn })
})
router.post('/login', async (req, res, next) => {
  var {email, password } = req.body;
  
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
    res.redirect(req.session.returnsTo || '/');
    delete req.session.returnsTo;
  } catch (error) {
      next(error);
  }
})

//edit user-profile
router.get('/:id/edit-profile',auth.verifyUserLogin, async (req, res, next) => {
  var user = await User.findById(req.params.id);
  try {
    if(user.id.toString() === req.user.id) {
      res.render("updateUser");
    } else {
      res.redirect('/')
    }
  } catch (error) {
      next(error);
  }
})

router.post('/:id/edit-profile', async (req, res, next) => {
  // if(req.file && req.file.filename) {
  //   req.body.image = req.file.filename;
  // }
  try {

    var user = await User.findById(req.params.id);
    if(user.id.toString() === req.user.id) {
      user.name = req.body.name;
      // user.image = req.body.image;
      user.save();
      res.redirect('/');
      
    } else {
      res.redirect('/');
    }
    
  } catch (error) {
      next(error);
  }
})

//logout
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect-sid');
  res.redirect('/');
})
module.exports = router;
