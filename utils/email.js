const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // create a transpoter
    const transpoter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Define the email options
    const mailOptions = {
        from: 'Mks Tamin <admin@mks.me>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transpoter.sendMail(mailOptions);
};

module.exports = sendEmail;
