module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define('professor', {
    first_name: {
      type: DataTypes.STRING,
      required: true,
    },
    last_name: {
      type: DataTypes.STRING,
      required: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  });

  return Professor;
};
