const nodemailer = require('nodemailer');

exports.contactUs = async(options) => {
    const transporter = nodemailer.createTransport({
        host:"gmail",
        auth:{
            user:"no-reply@gmail.com",
            pass:"gurtifoundation"
        }
    });

    const mailOptions = {
        from:"no-reply@gmail.com",
        to:"gurtiFoundation@gmial.com",
        subject:options.subject,
        message:{
            name:options.name,
            email:options.email,
            message:options.message
        }
    }

    await transporter.sendMail(mailOptions);
}