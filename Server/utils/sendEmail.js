const nodemailer = require("nodemailer");
// console.log("USER:", process.env.MAILTRAP_USER);
// console.log("PASS:", process.env.MAILTRAP_PASS);

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: '"BrainsKart" <no-reply@brainskart.com>',
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
