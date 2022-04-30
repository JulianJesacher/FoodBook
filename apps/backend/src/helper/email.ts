import nodemailer = require('nodemailer');

export const sendEmail = (email: string, userId: string, resetCode: string, username: string): void => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'julianjesacher02@gmail.com',
            pass: 'Tamara2007!',
        },
    });

    const message = {
        from: 'julianjesacher02@gmail.com',
        to: email,
        subject: 'FoodBook-Reset password',
        html: `
        <h1>Hello ${username}</h1>
        <p>To reset your password click on the button below. This link is only valid for ${process.env.RESET_PASSWORD_CODE_TIME} hours.

        <div style="background-color: rgb(0, 149, 255); display: flex; align-items: center; justify-content: center;">
            <a href="http://localhost:4200/resetPassword?${
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
