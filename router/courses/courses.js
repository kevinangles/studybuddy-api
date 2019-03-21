// const auth = require('../auth');
const middleware = require('./middleware');

const auth = require('../auth');

module.exports = (app) => {
  app.get('/search/:code/', auth.checkAuthenticated, (req, res, next) => {
    const code = req.params.code.toUpperCase();
    middleware.searchByCode(code)
      .then((result) => {
        res.json(result);
      })
      .catch(next);
  });
};
