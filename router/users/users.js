const auth = require('../auth');
const middleware = require('./middleware');

module.exports = (app) => {
  app.post('/register/', middleware.preRegister, (req, res, next) => {
    middleware.createUser(req, res).then((newUser) => {
      middleware.createEmailHash(newUser).then((record) => {
        middleware.sendVerificationEmail(newUser, record);
        auth.generateToken(res, record);
      }).catch(next);
    }).catch(next);
  });

  app.post('/login/', (req, res, next) => {
    middleware.login(req, res, next);
  });

  app.post('/verify/:hash/', (req, res, next) => {
    middleware.verifyHashExists(req, res, next)
      .then((record) => {
        record.destroy();
        middleware.verifyEmail(res, next, record);
      }).catch(next);
  });
};
