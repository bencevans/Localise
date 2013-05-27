

var db = require('../db');

module.exports.profile = function (req, res, next) {
  db.User.find({where: { id: 1 }, attributes: []}).success(function(user) {
    res.render('user', {user:user});
  }).error(function(error) {
    next(error);
  });
};

module.exports.updateProfile = function (req, res, next) {
  db.User.find({where: { id: 1 }, attributes: []}).success(function(user) {
    res.render('user', {user:user});
  }).error(function(error) {
    next(error);
  });
};