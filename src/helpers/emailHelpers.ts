import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface MailOptions { to: string; subject: string; html: string; }

export const sendEmail = (mailOptions: MailOptions) => {
  return transporter.sendMail({
      from: `"Clínica Caotrol" <${process.env.EMAIL_USER}>`,
      ...mailOptions
  });
};