const bodyParser = require('body-parser');
const cors = require('cors');

const env = require('./config');
const router = require('./router');
const db = require('./config/db.js');

module.exports = (app) => {
  app.use(bodyParser.json());
  // app.enable('trust proxy');

  // app.use(function (req, res, next) {
  //   if (req.secure) { return next(); }
  //   res.redirect("https://" + req.headers.host + req.url);
  // });

  app.use(cors({ origin: env.CORS_ORIGIN }));
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
