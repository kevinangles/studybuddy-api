module.exports = (sequelize, DataTypes) => {
  const emailHash = sequelize.define('emailHash', {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      required: true
    },
    hash: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
      timestamps: true,
      underscored: true,
    });
  return emailHash;
};