const Sequelize = require('sequelize');
const env = require('./env');
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: env.DATABASE_DIALECT,
  operatorsAliases: Sequelize.Op,
  define: {
    underscored: true
  }
});

// Connect all the models in the database to a db object,
// so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.users = require('../models/users.js')(sequelize, Sequelize);
db.courses = require('../models/courses.js')(sequelize, Sequelize);

// Relations
db.users.belongsToMany(db.courses, {through: 'users_courses'});
db.courses.belongsToMany(db.users, {through: 'users_courses'});

module.exports = db;