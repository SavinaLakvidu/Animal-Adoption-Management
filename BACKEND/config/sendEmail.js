import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is not defined in .env file. Emails will not be sent.");
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const sendEmail = async (to, subject, html) => {
  if (!resend) {
    console.warn("⚠️ Email service not configured. Skipping email send.");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "Pawfect <onboarding@resend.dev>", // ✅ keep for dev mode
      to,
      subject,
      html,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
      return { success: false, error };
    }

    console.log("✅ Email sent successfully:", data);
    return { success: true, data };

  } catch (err) {
    console.error("❌ Unexpected error sending email:", err);
    return { success: false, error: err };
  }
};

export default sendEmail;
