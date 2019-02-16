const Sequelize = require('sequelize');
const env = require('./');

const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  dialect: env.DATABASE_DIALECT,
  operatorsAliases: Sequelize.Op,
  define: {
    underscored: true,
  },
});

// Connect all the models in the database to a db object,
// so everything is accessible via one object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.users = require('../models/users.js')(sequelize, Sequelize);
db.courses = require('../models/courses.js')(sequelize, Sequelize);
db.emailHashes = require('../models/emailHashes')(sequelize, Sequelize);
db.user_courses = require('../models/userCourses')(sequelize, Sequelize);
db.professors = require('../models/professors')(sequelize, Sequelize);

// Relations
// db.users.belongsToMany(db.courses, {through: 'users_courses'});
// db.courses.belongsToMany(db.users, {through: 'users_courses', otherKey: 'code'});
db.professors.hasMany(db.courses, { foreignKey: 'id' });
db.courses.belongsTo(db.professors, { as: 'professor_data', foreignKey: 'id' });
db.users.belongsToMany(db.courses, { as: 'classes', through: 'user_courses' });
db.courses.belongsToMany(db.users, { as: 'students', through: 'user_courses' });

module.exports = db;
