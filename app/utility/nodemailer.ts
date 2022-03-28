import * as nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'viola.douglas80@ethereal.email',
        pass: 'DuSyrzsbbdBFV8UmFT'
    }
});