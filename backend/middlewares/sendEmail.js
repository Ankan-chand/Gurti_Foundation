const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "b3a7f55373cceb",
          pass: "1ed770ab1188bb"
        }
      });

    const mailOptions = {
        from: "GurtiFoundation@gmail.com",
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transport.sendMail(mailOptions);
};