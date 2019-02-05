const env = require('../../config');
const auth = require('../auth');

const check = require('express-validator');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

module.exports = {
  preRegister: (req, res, next) => {
    const domain = 'fiu.edu';

    if (req.body.first_name == '') { return res.status(409).send({ message: 'A first name is required' }); }

    if (req.body.last_name == '') { return res.status(409).send({ message: 'A last name is required' }); }

    if (req.body.email == '') { 
      return res.status(409).send({ message: 'A valid FIU email is required' });
    } else {
      if (req.body.email.split('@').pop() !== domain) {
        return res.status(409).send({ message: 'The email must be a valid FIU email' });
      }
    }

    if (req.body.password == '') { return res.status(409).send({ message: 'A valid password is required' }); }

    if (req.body.phone_number == '') { 
      return res.status(409).send({ message: 'A valid phone number is required' });
    } else {
      res.locals.phone_number = req.body.phone_number.replace(/\D/g, '');
    }

    next();
  },
  preLogin: (req, res, next) => {
    const domain = 'fiu.edu';

    if (req.body.email.split('@').pop() !== domain) {
      return res.status(409).send({ message: 'The email must be a valid FIU email' });
    }

    next();
  },
  login: (req, res, user) => {
    // If false, there was no email match
    if (user === '') {
      return res.status(409).send({ message: "The email doesn't exist in our records" }); 
    }

    // Compare the request's password with the hashed password
    bcrypt.compare(req.body.password, user.password).then(match => {
      if (!match) { 
        return res.status(409).send({ message: "The password doesn't match our records" });
      }
      // If passwords match, generate authentication token
      auth.generateToken(res, user);
    });
  },
  preVerify: (req, res, hash) => {
    if (hash.length !== 40) {
      return res.status(409).send({ message: 'Invalid verification hash' });
    }
  },
  verify: (res, foundHash) => {
    if (foundHash !== '') {
      return res.status(409).send({ message: 'Invalid email verification link' });
    }
  },
  transporter: nodemailer.createTransport({
    host: 'smtp.domain.com',
    port: 465,
    secure: true,
    auth: {
      user: env.NOREPLY_EMAIL_ADDRESS,
      pass: env.NOREPLY_EMAIL_PASSWORD
    }
  }),
  mailOptions: (user, url) => {
    return {
      from: '"Studybuddy" <noreply@studybuddy.coffee>',
      to: user.email,
      subject: "Verify your Email Address",
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
        `
    }
  },
}
