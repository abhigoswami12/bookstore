var User = require('../models/User');


exports.verifyUserLogin = (req, res, next) => {
    var userPassportId = req.session && req.session.passport && req.session.passport.user;
    if(req.session && req.session.userId) {
        next();
    } else if(userPassportId) {
        next();
    } else {
        req.session.returnsTo = req.originalUrl;
        req.flash("warn", "You need to first login to access this route");
        res.redirect("/users/login");
    }
}

exports.verifyAdminLogin = (req, res, next) => {
    var userPassportId = req.session && req.session.isAdmin &&  req.session.passport && req.session.passport.user;
    if (req.session && req.session.isAdmin &&  req.session.userId) {
        next();
    } else if (userPassportId) {
        next();
    } else {
        req.session.returnsTo = req.originalUrl;
        req.flash("warn", "You need to first login as Admin to access this route");
        res.redirect("/users/login");
    }
}

exports.userInfo = async (req, res, next) => {
    var userId = req.session && req.session.userId;
    var passportId = req.session && req.session.passport && req.session.passport.user;
    // console.log("passportId",passportId)
    try {
        if(userId) {
           var user = await User.findById(userId, "-password");
           req.user = user;
           res.locals.user = user;
        } else if(passportId) {
            var user = await User.findById(req.session.passport.user, (err, user) => {
                // console.log("REQUESTED USER",req.user)
                req.user = user;
                res.locals.user = user;
            })
        } else {
            req.user = null;
            res.locals.user = null;
        }
        next();
    } catch (error) {
      next(error)  ;
    }
}