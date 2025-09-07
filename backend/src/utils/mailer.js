// utils/mailer.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ email, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // or your preferred provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  });
};

module.exports = sendEmail;
