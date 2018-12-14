const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    first_name: {
      type: DataTypes.STRING(50),
      required: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      required: true
    },
    email: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
      defaultScope: {
        attributes: { exclude: ['password'] }
      },
      scopes: {
        withPassword: {
          attributes: {},
        }
      },
      timestamps: true,
      underscored: true,
    });

  User.beforeCreate((user, options, next) => {
    return bcrypt.hash(user.password, 10).then((hash) => {
      user.password = hash;
    }).catch(next);
  });

  User.prototype.toJSON = function () {
    var values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }

  return User;
};