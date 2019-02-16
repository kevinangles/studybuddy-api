const db = require('../../config/db');

module.exports = {
  searchByCode: code => db.courses.findAll({
    where: { code },
    include: [
      {
        model: db.users,
        as: 'students',
        through: { attributes: [] },
        attributes: { exclude: ['id'] },
      },
      {
        model: db.professors,
        as: 'professor_data',
        attributes: { exclude: ['id'] },
      },
    ],
    attributes: { exclude: ['id', 'professor'] },
  }),
};
