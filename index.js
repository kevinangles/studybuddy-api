const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db.js');
const env = require('./config/env');
const router = require('./router/index');

const app = express();
const PORT = env.PORT;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Content-Type', 'application/json');
  next();
});

router(app, db);

//drop and resync with { force: true }
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log('Express listening on port:', PORT);
  });
});