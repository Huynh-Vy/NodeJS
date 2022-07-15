const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oath2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oath2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (email, subject, text) => {
    try {
        const accessToken = await oath2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'Oauth2',
                user: 'noreply.test271@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
                pass: process.env.PASS,
            },
        });

        const mailOptions = {
            from: 'noreply.test271@gmail.com',
            to: email,
            subject: subject,
            text: text,
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
       console.log('error', error);
    }
};

module.exports = sendEmail;
