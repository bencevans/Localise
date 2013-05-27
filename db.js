
var Sequelize = require("sequelize");

var sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './db.sqlite'
});

var User = require('./models/User')(sequelize, Sequelize);
var Item = require('./models/Item')(sequelize, Sequelize);

Item.hasOne(User, {as: 'User'});

User.hasMany(Item, {as: 'Votes'});
Item.hasMany(User, {as: 'Votes'});

module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;

module.exports.User = User;
module.exports.Item = Item;

