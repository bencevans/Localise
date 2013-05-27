
module.exports = module.exports = function(sequelize, Sequelize) {
  return sequelize.define('User', {
    id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true},
    username: { type: Sequelize.STRING, allowNull: false, unique: true },
    password: { type: Sequelize.STRING, allowNull: false },
    bio: { type: Sequelize.STRING},
    email: { type: Sequelize.STRING},
    created: Sequelize.DATE
  });
};