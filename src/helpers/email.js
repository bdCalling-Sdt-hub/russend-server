const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "team.robust.dev@gmail.com", // todo
    pass: process.env.SMTP_PASSWORD, // todo
  },
});

const emailWithNodemailer = async (emailData) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USERNAME, // sender address
      to: emailData.email, // list of receivers
      subject: emailData.subject, // Subject line
      html: emailData.html, // html body
    };

    console.log("UserName");
    console.log(process.env.SMTP_USERNAME);
    console.log("password");
    console.log(process.env.SMTP_PASSWORD);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent %s", info.response);
  } catch (error) {
    console.error("Error sending mail", error);
    throw error;
  }
};

module.exports = emailWithNodemailer;
