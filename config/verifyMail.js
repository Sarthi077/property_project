import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({      
  host: process.env.ETHEREAL_HOST,
  port: process.env.ETHEREAL_PORT,
  secure: false,
  auth:{
    user:process.env.ETHEREAL_USER,
    pass:process.env.ETHEREAL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  const info = await transporter.sendMail({
    from: '"Rent Property" <no-reply@rentproperty.com>',
    to,
    subject,
    html
  });

  console.log("Verification email sent:", nodemailer.getTestMessageUrl(info));
}