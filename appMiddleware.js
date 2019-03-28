const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const env = require('./config');
const router = require('./router');
const db = require('./config/db.js');

module.exports = (app) => {
  app.use(bodyParser.json());
  app.use(helmet());

  app.use(cors({ origin: env.CORS_ORIGIN }));

  app.options('*', cors())
  router(app, db);

  app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    next();
  });

  // drop and resync with { force: true }
  db.sequelize.sync().then(() => {
    app.listen(env.port, () => {
      console.log('Express listening on port:', env.port);
    });
  });
};
