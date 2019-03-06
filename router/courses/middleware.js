const db = require('../../config/db');

module.exports = {
  searchByCode: code => db.courses.findAll({
    where: { code },
    include: [
      {
        model: db.users,
        as: 'students',
        through: { attributes: [] },
        attributes: { exclude: ['id', 'password', 'email_verified', 'created_at', 'updated_at'] },
      },
      {
        model: db.professors,
        as: 'professor',
        attributes: { exclude: ['id'] }
      },
    ],
    attributes: { exclude: ['id', 'professor_id'] },
  }),
};
