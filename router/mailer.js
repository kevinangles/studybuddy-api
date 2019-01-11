const env = require('./../config');

const nodemailer = require("nodemailer");

let mailer = {
  transporter: nodemailer.createTransport({
    host: 'smtp.domain.com',
    port: 465,
    secure: true,
    auth: {
      user: env.NOREPLY_EMAIL_ADDRESS,
      pass: env.NOREPLY_EMAIL_PASSWORD
    }
  })
};

module.exports = mailer;