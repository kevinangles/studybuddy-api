const auth = require('./../auth');
const mailer = require('./../mailer');

const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = (app, db) => {

  // POST register a new user
  app.post('/register/', (req, res, next) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const password = req.body.password;
    const phone_number = req.body.phone_number;
    const references = req.body.references;

    db.users.findOne({
      where: { email: email }
    })
      .then(existingUser => {
        if (existingUser) {
          return res.status(409).send({ message: 'The email ' + existingUser.email + ' is taken' });
        } else {
          db.users.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            phone_number: phone_number
          })
            .then(newUser => {
              for (reference of references) {
                newUser.addCourse(reference);
              }
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
                    html: `
                    <div style="width: 550px; background-color: #ffcc00; padding: 15px; margin: 0px auto;">
                      <div style="width: 500px; background-color: #fff; padding: 25px; font-size: 18px;">
                        <div style="width: 500px; text-align: center;">
                          <img src="https://res.cloudinary.com/studybuddy/image/upload/c_scale,q_100,w_350/v1547215183/logo.png">
                        </div><br>
                        Hi, ${newUser.first_name}!<br>
                        <br>
                        Thank you for joining Studybuddy! We're really excited to welcome you into our community of students from Florida International University. Before you start connecting with your peers, we need you to take a second to <b>verify your email address by clicking on the button below</b>:<br>
                        <br>
                        <a style="width: 175px; height: 60px; text-decoration: none; margin: 0px auto; background-color: #ffcc00; color: #fff; text-align: center; line-height: 60px; display: block;" href="${url}">Verify email</a>
                        <br>
                        Thanks again for joining 🤓<br>
                        <br>
                        Kevin Angles Belledonne<br>
                        Founder, Studybuddy<br>
                      </div>
                    </div>
                    `
                  }, (error, info) => {
                    if (error) { return console.log(error); }
                    console.log("Message sent: %s", info.messageId);
                  });
                  auth.generateToken(res, readyUser);
                })
                .catch(next);
            })
            .catch(next);
        }
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
        bcrypt.compare(password, foundUser.password).then(match => {
          if (match) { auth.generateToken(res, foundUser); }
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