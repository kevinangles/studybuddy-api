const env = require('./config');
const router = require('./router');
const db = require('./config/db.js');
const bodyParser = require('body-parser');

module.exports = function (app) {
  app.use(bodyParser.json());
  router(app, db);

  app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
  });

  //drop and resync with { force: true }
  db.sequelize.sync().then(() => {
    app.listen(env.port, () => {
      console.log('Express listening on port:', env.port);
    });
  });
}