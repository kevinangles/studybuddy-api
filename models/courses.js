module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('course', {
    reference: {
      type: DataTypes.STRING,
      required: true,
    },
    code: {
      type: DataTypes.STRING,
      required: true,
    },
    name: {
      type: DataTypes.STRING,
      required: true,
    },
    professor: {
      type: DataTypes.INTEGER,
      required: true,
    },
    type: {
      type: DataTypes.STRING,
      required: true,
    },
  },
  {
    timestamps: false,
    underscored: true,
  });

  return Course;
};
