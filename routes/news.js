
var async = require('async'),
_     = require('underscore');

var db = require('../db'),
Item = db.Item,
User = db.User;

module.exports.submit = function(req, res, next) {
  res.render('submit');
};

module.exports.submitAction = function(req, res, next) {
  Item.build(req.body).save().success(function(item) {
    item.setUser(req.user).success(function(item) {
      res.redirect('/item/' + item.id);
    }).error(next);
  }).error(next);
};

module.exports.item = function(req, res, next) {
  var itemid = parseInt(req.params.item, 10);
  Item.find({where:{id:itemid}}).success(function(item) {
    if(!item) return next();
    item.getUser().success(function(user) {
      res.send(_.extend(item.values, {user:user}));
    }).error(next);
  }).error(next);
};

module.exports.vote = function(req, res, next) {
  var itemid = parseInt(req.params.item, 10);
  Item.find({where:{id:itemid}}).success(function(item) {
    if(!item) return next();
    // check if already voted
    item.hasVote(req.user).success(function(hasVote) {
      if(hasVote) return res.send(403);
      item.addVote(req.user).success(function(vote) {
        res.redirect('/item/' + itemid);
      }).error(next);
    }).error(next);
  }).error(next);
};

module.exports['new'] = function(req, res, next) {
  Item.findAll({limit:20, order: 'createdAt DESC'}).success(function(items) {
    async.map(items, function(item, callback) {
      item.getUser({ attributes: ['username']}).success(function(user) {
        item.getVotes().success(function(votes) {
          callback(null, _.extend(item.values, _.extend({user:user}, {voteCount:votes.length})));
        }).error(callback);
      }).error(callback);
    }, function(error, items) {
      if(error) return next(error);
      console.log(items);
      res.render('index', {items:items});
    });
  }).error(next);
};

module.exports.index = function(req, res, next) {
  Item.findAll(['SELECT Items.id, Items.title, Items.url, COUNT(Votes.ItemId) AS something FROM Items ORDER BY ',
    'LOG10(ABS(100) + 1) * SIGN(100)',
    '+ (UNIX_TIMESTAMP(createdAt) / 300000) DESC',
    'LIMIT 50']).success(function(items) {
      async.map(items, function(item, callback) {
        item.getUser({ attributes: ['username']}).success(function(user) {
          item.getVotes().success(function(votes) {
            callback(null, _.extend(item.values, _.extend({user:user}, {voteCount:votes.length})));
          }).error(callback);
        }).error(callback);
      }, function(error, items) {
        if(error) return next(error);
        console.log(items);
        res.render('index', {items:items});
      });
    }).error(next);
  };

  module.exports.best =  function(req, res, next) {
    res.send('todo');
  };