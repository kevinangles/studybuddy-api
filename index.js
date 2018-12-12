// start server.js 
const express = require('express');
const app = express();
const appMiddleware = require('./appMiddleware');

appMiddleware(app);

module.exports = app;