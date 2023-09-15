const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {

    var transport = nodemailer.createTransport({
        host: "gmail",
        auth: {
          user: "no-reply@gmail.com",
          pass: "password"
        }
      });

    const mailOptions = {
        from: "no-reply@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transport.sendMail(mailOptions);
};