import nodemailer from "nodemailer";
import "dotenv/config";
import ProblemError from "./ProblemError";

const user = process.env.GMAIL_USER;
const pass = process.env.GMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user,
    pass,
  },
});

const sendConfirmationEmail = async (name, email, confirmationCode) => {
  try {
    await transport.sendMail({
      from: user,
      to: email,
      subject: "ASquare - Confirm your account",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for creating your account. Please confirm your email by clicking on the following link </p>
        <a href=http://localhost:3000/api/auth/active/${confirmationCode}>Click here</a>
        </div>`,
    });
  } catch (error) {
    throw new ProblemError(
      500,
      "email-error",
      "Error sending email",
      "Server was not able to send confirmation email. Please try again later."
    );
  }
};

export default sendConfirmationEmail;
