const jwt = require('jsonwebtoken');

const env = require('../config');

const auth = {
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
    const token = req.header('authorization').split(' ')[1];

    jwt.verify(token, env.SECRET_OR_PRIVATE_KEY, (err) => {
      if (err) {
        return res.status(401).send({ message: 'Token Expired' });
      }

      const payload = jwt.verify(token, env.SECRET_OR_PRIVATE_KEY);

      if (!payload) {
        return res.status(401).send({ message: 'Unathorized. Auth Header Invalid' });
      }

      // Place user id into request
      req.userId = payload.sub;

      return next();
    });
  },
};

module.exports = auth;
