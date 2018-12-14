module.exports = (app, db) => {

  // GET courses by code
  app.get('/search/:code/', (req, res, next) => {
    const code = req.params.code.toUpperCase();
    db.courses.findAll({
      where: { code: code },
      include: [{
        model: db.users,
        attributes: { exclude: ['id'] },
        through: {
          attributes: []
        }
      }]
    })
    .then(courses => {
      res.json(courses);
    })
  })

};