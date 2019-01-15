const env = require('./config');
const router = require('./router');
const db = require('./config/db.js');
const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = function (app) {
  app.use(bodyParser.json());
  app.use(cors({origin: 'http://localhost:4200'}));
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