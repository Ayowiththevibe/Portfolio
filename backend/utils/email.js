const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, message) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        }
    })

    const mailOptions = {
        from: email,
        to: process.env.USER_EMAIL,
        subject: `Portfolio Contact Form: ${subject}`,
        html: `
            <h3>You got a new message from your portfolio!</h3>
            <p><b>Name:</b> ${email}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b> ${message}</p>
        `
    }
    return transporter.sendMail(mailOptions)
}

module.exports = sendEmail;