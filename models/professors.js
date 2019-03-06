module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define('professor', {
    name: {
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
