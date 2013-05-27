

var db = require('../db'),
  Item = db.Item,
  User = db.User;

/**
 * Helper Middleware
 */

module.exports.isLoggedIn = function(req, res, next) {
  if(req.user)
    return next();
  return res.redirect('/auth');
};

module.exports.addUserToRequest = function(req, res, next) {
  if(!req.session.userid)
    return next();
  User.find({where:{id:req.session.userid}}).success(function(user) {
    if(!user)
      next(new Error('no user found, faker'));
    req.user = res.locals.currentUser = user;
    next();
  }).error(next);
};

/**
 * Pages
 */

module.exports.index = function(req, res, next) {
  if(req.user)
    return res.redirect('/');
  res.render('auth');
};

module.exports.login = function(req, res, next) {
  User.find({where:req.body}).success(function(user) {
    if(!user)
      return next(new Error('no user found'));
    req.session.userid = user.id;
    res.redirect('/');
  }).error(next);
};

module.exports.register = function(req, res, next) {
  if(!req.body.username || !req.body.password)
    res.send('missing a username or password');
  var user = User.build(req.body);
  user.save().success(function(user) {
    req.session.userid = user.id;
    res.redirect('/');
  }).error(function(err) {
    next(err);
  });
};


module.exports.logout = function(req, res, next) {
  req.session = false;
  res.redirect('/');
};