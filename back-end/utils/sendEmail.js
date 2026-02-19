// utils/sendEmails.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create and verify transporter once (better performance + catches config errors early)
const getEnv = (key) => process.env[key]?.trim();
const getPass = () => getEnv('PASSWORD_APP_EMAIL') || getEnv('APP_PASSWORD') || getEnv('PASSWORD');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,                  // false → use STARTTLS on port 587 (Google recommends this)
  auth: {
    user: getEnv('EMAIL'),      // ← must match your .env key
    pass: getPass(),  // support multiple possible env names
  },
  // Helpful for debugging (remove in production if you want)
  logger: true,                   // logs SMTP conversation to console
  debug: true,
  // In case of certificate issues (rare on Gmail)
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify connection on startup (very useful!)
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification FAILED:', error);
    // Helpful debug: if credentials missing, show a more specific error
    if (!getEnv('EMAIL') || !getPass()) {
      console.error('Missing email credentials. Ensure .env contains EMAIL and PASSWORD_APP_EMAIL (or APP_PASSWORD).');
    }
  } else {
    console.log('Email transporter is READY and connected to Gmail SMTP');
  }
});

function isValidEmail(email) {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
}

export const sendApprovalEmail = async (university) => {
  try {
    const senderEmail = getEnv('EMAIL');
    const recipientEmail = university.officialEmail?.trim();

    if (!senderEmail || !getPass()) {
      console.error("❌ EMAIL CONFIG ERROR: Missing EMAIL or Password in .env");
      return false;
    }

    if (!recipientEmail || !isValidEmail(recipientEmail)) {
      console.error(`❌ EMAIL ERROR: Invalid email address for university "${university.institutionName || '(unnamed)'}": ${recipientEmail}`);
      return false;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const mailOptions = {
      from: `"Unisphere Admin" <${senderEmail}>`,
      to: recipientEmail,
      subject: 'Your Institution Has Been Approved – Welcome to Unisphere!',
      text: `Dear ${university.contactPerson || 'Team'},\n\n` +
            `Your institution "${university.institutionName}" has been approved!\n\n` +
            `You can now log in here: ${frontendUrl}/university-login\n\n` +
            `Best regards,\nUnisphere Admin Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <h2 style="color: #6b46c1;">Congratulations!</h2>
          <p>Dear ${university.contactPerson || 'Team'},</p>
          <p>Your institution <strong>${university.institutionName}</strong> has been reviewed and <strong>approved</strong> by our admin team.</p>
          <p>You can now log in to the University Portal using your registered credentials:</p>
          <p style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}/university-login"
               style="background: #6b46c1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Log in to University Portal
            </a>
          </p>
          <p>If you have any questions, feel free to contact us at <a href="mailto:support@unisphere.edu">support@unisphere.edu</a>.</p>
          <p>Best regards,<br/>Unisphere Admin Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Approval email SENT → Message ID: ${info.messageId} → To: ${recipientEmail}`);
    return true;
  } catch (err) {
    console.error('Approval email FAILED:', err.message);
    console.error('Full error object:', err);
    return false;
  }
};

export const sendRejectionEmail = async (university, reason) => {
  try {
    const senderEmail = getEnv('EMAIL');
    const recipientEmail = university.officialEmail?.trim();

    if (!senderEmail || !getPass()) {
      console.error("❌ EMAIL CONFIG ERROR: Missing EMAIL or Password in .env");
      return false;
    }

    if (!recipientEmail || !isValidEmail(recipientEmail)) {
      console.error(`❌ EMAIL ERROR: Invalid email address for university "${university.institutionName || '(unnamed)'}": ${recipientEmail}`);
      return false;
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const mailOptions = {
      from: `"Unisphere Admin" <${senderEmail}>`,
      to: recipientEmail,
      subject: 'Your Institution Registration – Decision from Unisphere',
      text: `Dear ${university.contactPerson || 'Team'},\n\n` +
            `We reviewed your institution "${university.institutionName}" registration.\n\n` +
            `Decision: Rejected\n` +
            (reason ? `Reason: ${reason}\n` : '') +
            `If you believe this was in error, contact support@unisphere.edu\n\n` +
            `Best regards,\nUnisphere Admin Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <h2 style="color: #6b46c1;">Registration Update</h2>
          <p>Dear ${university.contactPerson || 'Team'},</p>
          <p>We reviewed your institution <strong>${university.institutionName}</strong> registration request.</p>
          <p><strong>Decision:</strong> <span style="color:#c53030">Rejected</span></p>
          ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
          <p>If you believe this was in error or want to provide more information, please contact our support at <a href="mailto:support@unisphere.edu">support@unisphere.edu</a>.</p>
          <p>Best regards,<br/>Unisphere Admin Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Rejection email SENT → Message ID: ${info.messageId} → To: ${recipientEmail}`);
    return true;
  } catch (err) {
    console.error('Rejection email FAILED:', err.message);
    console.error('Full error object:', err);
    return false;
  }
};