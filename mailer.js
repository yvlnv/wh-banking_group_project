const nodemailer = require('nodemailer')
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

class Mailer {
    static sent = []

    constructor(from) {
        this.from = from
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ADDRESS,
                pass: process.env.GMAIL_PASSWORD
            }
        })
    }

    sendEmailInvite(to) {
        const email = {
            from: this.from,
            to: to,
            subject: "Let's become friends",
            html: `Hi there,<br>I would like to invite you to be my friend! <br> 
            <a href="${process.env.BASE_URL}/friends/accept?from=${encodeURIComponent(this.from)}&to=${encodeURIComponent(to)}">Accept Request</a>`,
            replyTo: 'no-reply@banking-app.com'
        }
        this.transport.sendMail(email, (err, result) => {
            Mailer.sent.push(err || result)
        })
    }
}

module.exports = Mailer
