
module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Item', {
    id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true},
    title: { type: Sequelize.STRING, allowNull: false},
    url: { type: Sequelize.STRING, isUrl: true},
    description: { type: Sequelize.TEXT, allowNull: true},
    created: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
  });
};