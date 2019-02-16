// const auth = require('../auth');
const middleware = require('./middleware');

module.exports = (app) => {
  app.get('/search/:code/', (req, res, next) => {
    const code = req.params.code.toUpperCase();
    middleware.searchByCode(code)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });
};
