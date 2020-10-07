const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secureConnection : true ,
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS
    },
    
});