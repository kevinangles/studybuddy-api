const auth = require('../auth');
const middleware = require('./middleware');

const crypto = require('crypto');

module.exports = (app, db) => {
  app.post('/register/', middleware.preRegister, (req, res, next) => {
    // Email verification hash & URL
    const hash = crypto.randomBytes(20).toString('hex');
    let verifyURL = 'https://www.studybuddy.coffee/verify/';

    db.users.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      phone_number: res.locals.phone_number,
    }).then(newUser => {
      db.emailHashes.create({
        uuid: newUser.uuid,
        hash: hash,
    }).then(readyUser => {
      verifyURL += readyUser.hash;
      middleware.transporter.sendMail(middleware.mailOptions(newUser, verifyURL), (error, info) => {
        if (error) { return console.log(error); }
        console.log("Message sent: %s", info.messageId);
      });
      auth.generateToken(res, readyUser);
      }).catch(next);
    }).catch(next);
  });

  app.post('/login/', middleware.preLogin, (req, res, next) => {
    db.users.scope('withPassword').findOne({
      where: { email: req.body.email },
      attributes: { exclude: ['id'] }
    }).then(user => {
      middleware.login(req, res, user);
    }).catch(next);
  });

  app.post('/verify/:hash/', middleware.preVerify, (req, res, next) => {
    db.emailHashes.findOne({
      where: { hash: req.params.hash }
    }).then(foundHash => {
      middleware.verify(res, foundHash);
      foundHash.destroy();
      db.users.update({ email_verified: true }, {
        where: { uuid: foundHash.uuid },
        returning: true,
        plain: true
    }).then(updatedUser => {
      res.json(updatedUser[1].dataValues);
      }).catch(next);
    }).catch(next);
  });
};