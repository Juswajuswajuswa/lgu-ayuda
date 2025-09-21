import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL_SECRET,
    pass: process.env.NODEMAILER_EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL_SECRET,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};
