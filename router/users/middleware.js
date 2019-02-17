const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const env = require('../../config');
const auth = require('../auth');
const db = require('../../config/db');

module.exports = {
  preRegister: (req, res, next) => {
    const domain = 'fiu.edu';

    if (req.body.first_name === '') {
      return res.status(409).send({ message: 'A first name is required' });
    }

    if (req.body.last_name === '') {
      return res.status(409).send({ message: 'A last name is required' });
    }

    if (req.body.email === '') {
      return res.status(409).send({ message: 'An FIU email is required' });
    }

    if (req.body.email.split('@').pop() !== domain) {
      return res.status(409).send({ message: 'The email must be a valid FIU email' });
    }

    if (req.body.password === '') { return res.status(409).send({ message: 'A password is required' }); }

    if (req.body.phone_number === '') { return res.status(409).send({ message: 'A phone number is required' }); }

    // Removes all characters, except digits
    res.locals.phone_number = req.body.phone_number.replace(/\D/g, '');

    // Checks if email already exists in database
    return db.users.findOne({
      where: { email: req.body.email },
    }).then((found) => {
      if (found) {
        return res.status(409).send({ message: 'The email already exists in our records' });
      }
      return next();
    }).catch(next);
  },
  login: (req, res, next) => {
    const domain = 'fiu.edu';

    if (req.body.email.split('@').pop() !== domain) {
      return res.status(409).send({ message: 'The email must be a valid FIU email' });
    }

    return db.users.scope('withPassword').findOne({
      where: { email: req.body.email },
      attributes: { exclude: ['id'] },
    }).then((user) => {
      // If false, there was no email match
      if (user === '') {
        return res.status(409).send({ message: "The email doesn't exist in our records" });
      }

      // Compare the request's password with the hashed password
      return bcrypt.compare(req.body.password, user.password)
        .then((match) => {
          if (!match) {
            return res.status(409).send({ message: "The password doesn't match our records" });
          }
          // If passwords match, generate authentication token
          return auth.generateToken(res, user);
        }).catch(next);
    }).catch(next);
  },
  preVerify: (req, res, next) => {
    if (req.params.hash.length !== 40) {
      return res.status(409).send({ message: 'Invalid verification hash' });
    }
    return next();
  },
  verifyHashExists: (req, res, next) => new Promise((resolve) => {
    const { hash } = req.params;
    db.emailHashes.findOne({
      where: { hash },
    }).then((record) => {
      if (record === null) {
        return res.status(409).send({ message: 'Invalid email verification link' });
      }
      return resolve(record);
    }).catch(next);
  }),
  verifyEmail: (res, next, record) => {
    const { uuid } = record.uuid;
    db.users.update({ email_verified: true }, {
      where: { uuid },
      returning: true,
      plain: true,
    }).then(updatedUser => res.json(updatedUser[1].dataValues)).catch(next);
  },
  transporter: nodemailer.createTransport({
    host: 'smtp.domain.com',
    port: 465,
    secure: true,
    auth: {
      user: env.NOREPLY_EMAIL_ADDRESS,
      pass: env.NOREPLY_EMAIL_PASSWORD,
    },
  }),
  mailOptions: (user, url) => ({
    from: '"Studybuddy" <noreply@studybuddy.coffee>',
    to: user.email,
    subject: 'Verify your Email Address',
    html:
      `
        <div style="width: 550px; background-color: #ffcc00; padding: 15px; margin: 0px auto;">
          <div style="width: 500px; background-color: #fff; padding: 25px; font-size: 18px;">
            <div style="width: 500px; text-align: center;">
              <img src="https://res.cloudinary.com/studybuddy/image/upload/c_scale,q_100,w_350/v1547215183/logo.png">
            </div><br>
            Hi, ${user.first_name}!<br>
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
      `,
  }),
};
