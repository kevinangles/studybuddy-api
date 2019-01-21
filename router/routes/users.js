const auth = require('./../auth');
const mailer = require('./../mailer');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const sanitizePhoneNumber = phone_number => phone_number.replace(/\D/g, '');

const verifyEmailDomain = email => {
  const domain = 'fiu.edu';
  return email.split('@').pop() === domain;
}

module.exports = (app, db) => {

  // POST register a new user
  app.post('/register/', (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const phone_number = sanitizePhoneNumber(req.body.phone_number);
    // const references = req.body.references;

    if (!verifyEmailDomain(email)) { return res.status(409).send({ message: 'Email must be valid FIU email' }); }

    db.users.findOne({
      where: { email: email }
    })
      .then(existingUser => {
        if (existingUser) { return res.status(409).send({ message: 'Email ' + existingUser.email + ' is already taken' }); }
        db.users.create({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          phone_number: phone_number
        })
          .then(newUser => {
            // for (reference of references) {
            //   newUser.addCourse(reference);
            // }
            const hash = crypto.randomBytes(20).toString('hex');
            db.emailHashes.create({
              uuid: newUser.uuid,
              hash: hash
            })
              .then(readyUser => {
                let url = `https://www.studybuddy.coffee/verify/${readyUser.hash}`;
                mailer.transporter.sendMail({
                  from: '"Studybuddy" <noreply@studybuddy.coffee>',
                  to: newUser.email,
                  subject: "Verify your Email Address",
                  html: mailer.html(newUser.first_name, url),
                }, (error, info) => {
                  if (error) { return console.log(error); }
                  console.log("Message sent: %s", info.messageId);
                });
                auth.generateToken(res, readyUser);
              })
              .catch(next);
          })
          .catch(next);
      })
      .catch(next)
  });

  // POST log a user in
  app.post('/login/', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    db.users.scope('withPassword').findOne({
      where: { email: email },
      attributes: { exclude: ['id'] }
    })
      .then(foundUser => {
        if (!foundUser) { return res.status(409).send({ message: 'Email is invalid' }); }
        bcrypt.compare(password, foundUser.password).then(match => {
          if (!match) { return res.status(409).send({ message: 'Password is invalid' }); }
          auth.generateToken(res, foundUser);
        });
      })
      .catch(next);
  });

  app.put('/verify/:hash/', (req, res, next) => {
    const hash = req.params.hash;

    db.emailHashes.findOne({
      where: { hash: hash }
    })
      .then(foundUUID => {
        if (!foundUUID) { return res.status(409).send({ message: 'Email verification link expired or is invalid' }); }
        foundUUID.destroy();
        db.users.update({ email_verified: true }, {
          where: { uuid: foundUUID.uuid },
          returning: true,
          plain: true
        })
          .then(updatedUser => {
            res.json(updatedUser[1].dataValues);
          })
          .catch(next);
      })
      .catch(next);
  })
};