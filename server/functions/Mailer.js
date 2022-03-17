const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
});

const mailer = async (toEmail, subject, text, html) => {
    let mailOptions = {
        from: `"Revolved Design" <noreply@revolveddesign.com>`,
        to: toEmail,
        subject: subject,
        text: text,
        html: html
    }

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return resolve({ success: 0, message: error });
            return resolve({ success: 1, message: info });
        })
    })
}

module.exports = {
    mailer
};