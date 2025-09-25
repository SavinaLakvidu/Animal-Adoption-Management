const verifyEmailTemplate = ({ name, url }) => {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;">
        <h1 style="color: #800020;">Hello ${name},</h1>
        <p>Thank you for joining <strong>Pawfect Home</strong>! We’re excited to have you on board in your journey to find the perfect furry friend.</p>
        <p>Please click the button below to verify your email and activate your account:</p>
        <a href="${url}" style="
          display: inline-block;
          background-color: #800020;
          color: white;
          padding: 12px 25px;
          font-weight: bold;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 10px;
        ">
          Verify Email
        </a>
        <p style="margin-top: 20px;">If you didn’t create an account, please ignore this email.</p>
        <p>Best wishes,<br><strong>Pawfect Home Team</strong></p>
      </div>
    `;
  };
  
  export default verifyEmailTemplate;
  