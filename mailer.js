const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atikbilal2000@gmail.com',
    pass: 'ucsspbaetzybwvpc'
  }
});

function sendAlert(to, message) {
  const mailOptions = {
    from: '"Secure Login System" <atikbilal2000@gmail.com>',
    to: to,
    subject: 'Security Alert 🚨',
    text: message
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.log(err);
    else console.log("Email sent");
  });
}

module.exports = sendAlert;