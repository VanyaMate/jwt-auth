const nodemailer = require('nodemailer');

class MailService {
    constructor () {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            }
        });
    }

    async sendActivationMail (to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: to,
            subject: 'Активация аккаунта',
            text: '',
            html: `
                <div>
                    <h1>Активация
                    <a href="${link}">Ссылка</a>
                </div>
            `
        })
    }
}

module.exports = new MailService();