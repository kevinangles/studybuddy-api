module.exports = (sequelize) => {
  const userCourse = sequelize.define('user_courses', {
  },
  {
    timestamps: true,
    underscored: true,
  });

  return userCourse;
};
