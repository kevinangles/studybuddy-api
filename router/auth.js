const env = require('../config');

const jwt = require('jsonwebtoken');

var auth = {
  generateToken: (res, user) => {
    const token = jwt.sign({ sub: user.uuid }, env.SECRET_OR_PRIVATE_KEY, { expiresIn: '1h' });
    return res.status(200).send({ token });
  },
  checkAuthenticated: (req, res, next) => {
    // Check if auth header exists
    if (!req.header('authorization')) {
      return res.status(401).send({ message: 'Unathorized. Missing Auth Header' });
    }

    // Turn auth header into an array,get and decode token
    var token = req.header('authorization').split(' ')[1];

    jwt.verify(token, env.SECRET_OR_PRIVATE_KEY, function (err, verified) {
      if (err) {
        return res.status(401).send({ message: 'Token Expired' });
      } else {
        var payload = jwt.verify(token, env.SECRET_OR_PRIVATE_KEY);

        if (!payload) {
          return res.status(401).send({ message: 'Unathorized. Auth Header Invalid' });
        }

        // Place user id into request
        req.userId = payload.sub;

        next();
      }
    });
  }
};

module.exports = auth;