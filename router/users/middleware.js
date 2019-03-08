const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const env = require('../../config');
const auth = require('../auth');
const db = require('../../config/db');

module.exports = {
  preRegister: (req, res, next) => {
    const domain = 'fiu.edu';
    const { body } = req;

    // Check for all required fields
    if (!(body.first_name && body.last_name && body.email && body.password
      && body.phone_number)) {
      return res.status(409).send({ message: 'All fields are required' });
    }

    // Check for FIU email domain
    if (body.email.split('@').pop() !== domain) {
      return res.status(409).send({ message: 'The email must be a valid FIU email' });
    }

    // Remove all characters, except digits
    res.locals.phone_number = body.phone_number.replace(/\D/g, '');

    // Check for existing email
    return db.users.findOne({
      where: { email: body.email },
    }).then((found) => {
      if (found) {
        return res.status(409).send({ message: 'The email already exists in our records' });
      }
      return next();
    }).catch(next);
  },
  createUser: (req, res) => db.users.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    phone_number: res.locals.phone_number,
  }),
  createEmailHash: (newUser) => {
    const hash = crypto.randomBytes(20).toString('hex');
    const { uuid } = newUser;

    return db.emailHashes.create({
      uuid,
      hash,
    });
  },
  login: (req, res, next) => {
    const domain = 'fiu.edu';
    const { email } = req.body;

    if (req.body.email.split('@').pop() !== domain) {
      return res.status(409).send({ message: 'The email must be a valid FIU email' });
    }

    return db.users.scope('withPassword').findOne({
      where: { email },
      attributes: { exclude: ['id'] },
    }).then((user) => {
      // If false, there was no email match
      if (user === null) {
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
        <div style="width: 500px; background-color: #fff; margin-top: 15px; margin-right: auto; margin-left: auto; font-size: 18px;">
          <div style="width: 500px; text-align: center; margin-top: 15px; margin-bottom: 25px;">
            <img src="https://res.cloudinary.com/studybuddy/image/upload/c_scale,q_auto:best,w_250/v1552065636/logo.png">
          </div>
          Hi, ${user.first_name}!<br>
          <br>
          We're really excited to welcome you into our community of students from Florida International University. Before you start connecting with your peers, we need you to take a second to <b>verify your email address by clicking on the button below</b>:<br>
          <br>
          <a style="width: 150px; height: 50px; text-decoration: none; margin-right: auto; margin-bottom: 15px; margin-left: auto; background-color: #fdbd00; color: #fff; text-align: center; line-height: 50px; display: block; font-weight: 500; border-radius: 0.25rem;" href="${url}">Verify email</a>
          <br>
          Stay awesome,<br>
          <br>
          Kevin Angles Belledonne<br>
          Founder, Studybuddy<br>
        </div>
      `,
  }),
  sendVerificationEmail(user, record) {
    const url = `https://studybuddy.coffee/verify/${record.hash}`;
    this.transporter.sendMail(this.mailOptions(user, url), (error, info) => {
      if (error) { return console.log(error); }
      return console.log('Message sent: %s', info.messageId);
    });
  },
};
