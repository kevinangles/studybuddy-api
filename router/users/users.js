const crypto = require('crypto');

const auth = require('../auth');
const middleware = require('./middleware');

module.exports = (app, db) => {
  app.post('/register/', middleware.preRegister, (req, res, next) => {
    // Email verification hash & URL
    const hash = crypto.randomBytes(20).toString('hex');
    let verifyURL = 'https://sbclient.appspot.com/verify/';

    db.users.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      phone_number: res.locals.phone_number,
    }).then((newUser) => {
      db.emailHashes.create({
        uuid: newUser.uuid,
        hash,
      }).then((readyUser) => {
        verifyURL += readyUser.hash;
        middleware.transporter.sendMail(middleware.mailOptions(newUser, verifyURL),
          (error, info) => {
            if (error) { return console.log(error); }
            return console.log('Message sent: %s', info.messageId);
          });
        auth.generateToken(res, readyUser);
      }).catch(next);
    }).catch(next);
  });

  app.post('/login/', (req, res, next) => {
    middleware.login(req, res, next);
  });

  app.post('/verify/:hash/', middleware.preVerify, (req, res, next) => {
    middleware.verifyHashExists(req, res, next)
      .then((record) => {
        record.destroy();
        middleware.verifyEmail(res, next, record);
      }).catch(next);
  });
};
