import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  }
});

export const sendOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VIPLORA - Email Verification OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">Welcome to Viplora Foundation</h2>
        <p>Your verification code is:</p>
        <div style="text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF9F1C; margin: 30px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendForgotPasswordOTPEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VIPLORA - Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">Password Reset Request</h2>
        <p>You requested a password reset. Your OTP is:</p>
        <div style="text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #FF9F1C; margin: 30px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email: string, resetLink: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VIPLORA - Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #FF9F1C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendVolunteerApprovalWithCredentials = async (email: string, password: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VIPLORA - Volunteer Application Approved & Account Created',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">Congratulations!</h2>
        <p>Your application to volunteer with Viplora Foundation has been **Approved**.</p>
        <p>We have created an account for you with the following credentials:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        <p style="color: #FF9F1C; font-weight: bold;">IMPORTANT: Please change your password immediately after your first login.</p>
        <p>Welcome to the team!</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendVolunteerApprovalNotification = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VIPLORA - Volunteer Application Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">Congratulations!</h2>
        <p>Your application to volunteer with Viplora Foundation has been **Approved**.</p>
        <p>Since you already have a user account, your role has been upgraded to **Volunteer**.</p>
        <p>Log in with your existing credentials to access the Volunteer Dashboard.</p>
        <p>Welcome to the team!</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendVolunteerApplicationConfirmationEmail = async (email: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'VIPLORA - Volunteer Application Received',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">THANK YOU!</h2>
        <p>We have received your application to volunteer with Viplora Foundation.</p>
        <p>Our Admin team will review your application shortly and get back to you with the details.</p>
        <p>Best Regards,</p>
        <p>Viplora Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export const sendNoticeEmail = async (email: string, title: string, message: string, link?: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `VIPLORA ALERT - ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
        <h2 style="color: #2D5F2E; text-align: center;">New Official Announcement</h2>
        <h3 style="color: #333;">${title}</h3>
        <p style="color: #555; line-height: 1.6;">${message}</p>
        ${link ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" style="background-color: #FF9F1C; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Details / Join</a>
        </div>` : ''}
        <p style="font-size: 11px; color: #999; margin-top: 30px;">You are receiving this because you are an approved volunteer at Viplora Foundation.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
