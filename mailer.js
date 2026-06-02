require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function sendAlert(to, message) {
  const mailOptions = {
    from: `"Secure Login System" <${process.env.MAIL_USER}>`,
    to: to,
    subject: 'Security Alert 🚨',
    text: message
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Mail Error:", err);
    } else {
      console.log("Email sent to:", to);
    }
  });
}

module.exports = sendAlert;

module.exports = sendAlert;