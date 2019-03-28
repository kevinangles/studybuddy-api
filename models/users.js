const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: {
      type: DataTypes.STRING,
      required: true,
    },
    last_name: {
      type: DataTypes.STRING,
      required: true,
    },
    email: {
      type: DataTypes.STRING(100),
      required: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(100),
      required: true,
    },
    phone_number: {
      type: DataTypes.STRING(15),
      required: true,
      unique: true,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    details: {
      type: DataTypes.STRING(150),
    },
    picture: {
      type: DataTypes.STRING(100),
    },
  },
  {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
    timestamps: true,
    underscored: true,
  });

  User.beforeCreate((user, options, next) => bcrypt.hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
    })
    .catch(next));

  User.prototype.toJSON = () => {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};
