var User = require('../models/User');


exports.userInfo = async (req, res, next) => {
    var userId = req.session && req.session.userId
    try {
        if(userId) {
           var user = await User.findById(userId, "-password");
           req.user = user;
           res.locals = user;
        } else {
            req.user = null;
            res.locals.user = null;
        }
        next();
    } catch (error) {
      next(error)  ;
    }
}