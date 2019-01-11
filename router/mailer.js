const nodemailer = require("nodemailer");

let mailer = {
  transporter: nodemailer.createTransport({
    host: 'smtp.domain.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'noreply@studybuddy.coffee', // generated ethereal user
      pass: 'wzQjK6VJmM9c8cSE' // generated ethereal password
    }
  }),
  mailOptions: {
    from: '"Studybuddy" <noreply@studybuddy.coffee>', // sender address
    to: "kevinangles@gmail.com", // list of receivers
    subject: "Studybuddy Email Verification! 🤓", // Subject line
    // text: "Hi! Please, confirm your email.", // plain text body
    html: "<b>Hello world?</b>" // html body
  }
};

module.exports = mailer;