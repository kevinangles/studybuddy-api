const auth = require('../auth');
const middleware = require('./middleware');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (app, db) => {

  app.post('/register/', (req, res, next) => {
    // Email verification hash & URL
    const hash = crypto.randomBytes(20).toString('hex');
    let verifyURL = 'https://www.studybuddy.coffee/verify/';

    // Check for FIU email
    middleware.isFiuEmail(req.body.email, res);

    db.users.create({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
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
    });
  });

  // POST log a user in
  app.post('/login/', (req, res, next) => {
    db.users.scope('withPassword').findOne({
      where: { email: req.body.email },
      attributes: { exclude: ['id'] }
    }).then(foundUser => {
      if (!foundUser) { return res.status(409).send({ message: 'Email is invalid' }); }
      bcrypt.compare(req.body.password, foundUser.password).then(match => {
        if (!match) { return res.status(409).send({ message: 'Password is invalid' }); }
        auth.generateToken(res, foundUser);
      }).catch(next);
    });
  });

  app.post('/verify/:hash/', (req, res, next) => {
    db.emailHashes.findOne({
      where: { hash: req.params.hash }
    }).then(foundUUID => {
      if (!foundUUID) { return res.status(409).send({ message: 'Email verification link expired or is invalid' }); }
      foundUUID.destroy();
      db.users.update({ email_verified: true }, {
        where: { uuid: foundUUID.uuid },
        returning: true,
        plain: true
    }).then(updatedUser => {
      res.json(updatedUser[1].dataValues);
      }).catch(next);
    });
  });
};