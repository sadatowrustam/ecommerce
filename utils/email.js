const nodemailer = require('nodemailer');
exports.sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: 'yandex',
        auth: {
            user: 'sadatov@geekspace.dev',
            pass: 'geekspace',
        },
    });
    const mailOptions = {
        from: `Contact-Us <rustamsadatov@gmail.com>`,
        to: 'hydyrowayhan7@gmail.com',
        subject: 'Biri "E-commerce" administratsiýasy bilen habarlaşmak isleýär',
        text: `ADY: ${options.name},\n\n EMAIL: ${options.email}, \n\n TELEFON: ${options.phone},\n\nHATY: ${options.text}`,
    };
    await transporter.sendMail(mailOptions);
};