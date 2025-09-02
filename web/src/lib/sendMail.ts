import nodemailer from "nodemailer";
import "dotenv/config";

async function sendEmail({ email, name }: { email: string; name: string }) {
  const mailSubject = `Welcome to Social`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.NEXT_PUBLIC_MAIL_ID!,
      pass: process.env.NEXT_PUBLIC_MAIL_PASS!,
    },
  });

  const mailOptions = {
    from: {
      name: "Social",
      address: process.env.MAIL_ID!,
    },
    to: [email],
    subject: mailSubject,
    text: `
    Welcome ${name}!
    We are pleased to have you on our platform
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export default sendEmail;
