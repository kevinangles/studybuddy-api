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
  }),
  html: (first_name, url) => {
    return `
    <div style="width: 550px; background-color: #ffcc00; padding: 15px; margin: 0px auto;">
      <div style="width: 500px; background-color: #fff; padding: 25px; font-size: 18px;">
        <div style="width: 500px; text-align: center;">
          <img src="https://res.cloudinary.com/studybuddy/image/upload/c_scale,q_100,w_350/v1547215183/logo.png">
        </div><br>
        Hi, ${first_name}!<br>
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
  `;
  }
};

module.exports = mailer;