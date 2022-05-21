import nodemailer = require('nodemailer');

export const sendEmail = (email: string, userId: string, resetCode: string, username: string): void => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_USERNAME,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  const message = {
    from: process.env.GOOGLE_USERNAME,
    to: email,
    subject: 'FoodBook - Reset password',
    html: `
        <h1>Hello ${username},</h1>
        <p>to reset your password click on the button below. This link is only valid for ${process.env.RESET_PASSWORD_CODE_TIME} hours.

        <div style="background-color: rgb(0, 149, 255); display: inline-flex; width: fit-content; border-radius: 20px; margin: auto 0;">
            <a href="${process.env.FRONTEND_HOST}/resetPassword?${
      'userId=' + userId + '&code=' + resetCode
    }" style="text-decoration: none; color: white; margin: 3em 1em;">Reset password</a>
        </div>
        `,
  };

  transporter.sendMail(message, function (err, info) {
    if (err) {
      throw new Error(err);
    }
  });
};
