const { Resend } = require('resend');

const sendEmail = async (email, subject, message) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.USER_EMAIL,
    subject: `Portfolio Contact: ${subject}`,
    html: `
      <h3>New message from your portfolio!</h3>
      <p><b>From:</b> ${email}</p>
      <p><b>Subject:</b> ${subject}</p>
      <p><b>Message:</b> ${message}</p>
    `
  });
};

module.exports = sendEmail;