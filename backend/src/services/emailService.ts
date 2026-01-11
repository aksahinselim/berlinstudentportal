import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Create a persistent transporter instance (connection pooling)
let transporter: Transporter | null = null;

/**
 * Get or create email transporter with connection pooling
 */
const getTransporter = (): Transporter => {
  if (!transporter) {
    console.log('🔧 Creating Gmail SMTP transporter...');
    
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      pool: true, // Use connection pooling
      maxConnections: 5,
      maxMessages: 100,
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates (development)
      },
    });

    // Verify connection configuration
    transporter.verify((error, success) => {
      if (error) {
        console.error('❌ SMTP Connection Error:', error);
        console.error('   Please check your SMTP settings in .env file');
        console.error('   User:', process.env.SMTP_USER);
        console.error('   Host:', process.env.SMTP_HOST);
        console.error('   Port:', process.env.SMTP_PORT);
      } else {
        console.log('✅ SMTP Server is ready to send emails!');
        console.log('   Connected to:', process.env.SMTP_HOST);
        console.log('   From:', process.env.SMTP_USER);
      }
    });
  }
  
  return transporter;
};

/**
 * Send OTP verification email
 */
export async function sendOtpEmail(email: string, code: string, name: string): Promise<void> {
  console.log(`📧 Sending OTP email to: ${email}`);
  console.log(`   Code: ${code}`);
  console.log(`   Name: ${name}`);
  
  const transporter = getTransporter();
  
  const ttl = process.env.OTP_TTL_MINUTES || '10';
  
  const mailOptions = {
    from: process.env.MAIL_FROM || 'Berlin Student Portal <noreply@example.invalid>',
    to: email,
    subject: 'Your Berlin Student Portal Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #E2382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #E2382A; text-align: center; letter-spacing: 8px; margin: 20px 0; padding: 15px; background-color: white; border-radius: 8px; border: 2px dashed #E2382A; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Email Verification</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Thank you for registering with Berlin Student Portal! To complete your registration, please verify your email address using the code below:</p>
            
            <div class="otp-code">${code}</div>
            
            <p><strong>This code will expire in ${ttl} minutes.</strong></p>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Berlin Student Portal will never ask for your verification code via phone or email.
            </div>
            
            <p>If you didn't request this verification code, please ignore this email.</p>
            
            <p>Best regards,<br>Berlin Student Portal Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Berlin Student Portal. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hello ${name},

Thank you for registering with Berlin Student Portal!

Your verification code is: ${code}

This code will expire in ${ttl} minutes.

Never share this code with anyone. If you didn't request this code, please ignore this email.

Best regards,
Berlin Student Portal Team

© ${new Date().getFullYear()} Berlin Student Portal. All rights reserved.
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);
  } catch (error: any) {
    console.error('❌ Error sending OTP email:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    console.error('   Command:', error.command);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('Gmail authentication failed. Please check your email and app password.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to Gmail SMTP server. Please check your internet connection.');
    } else if (error.responseCode === 535) {
      throw new Error('Invalid Gmail credentials. Please verify your email and app password.');
    } else {
      throw new Error(`Failed to send verification email: ${error.message}`);
    }
  }
}

/**
 * Send welcome email after successful verification
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  console.log(`📧 Sending welcome email to: ${email}`);
  const transporter = getTransporter();
  
  const mailOptions = {
    from: process.env.MAIL_FROM || 'Berlin Student Portal <noreply@example.invalid>',
    to: email,
    subject: 'Welcome to Berlin Student Portal! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #E2382A; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; padding: 12px 30px; background-color: #E2382A; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Berlin Student Portal!</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Your email has been successfully verified! You now have full access to Berlin Student Portal.</p>
            
            <p><strong>What you can do now:</strong></p>
            <ul>
              <li>Ask questions in your university community</li>
              <li>Answer questions from fellow students</li>
              <li>Share knowledge and resources</li>
              <li>Connect with students from your university</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/feed" class="button">Go to Feed</a>
            </div>
            
            <p>If you have any questions or need help, feel free to reach out to our support team.</p>
            
            <p>Happy learning!<br>Berlin Student Portal Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Berlin Student Portal. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully!');
    console.log('   Message ID:', info.messageId);
  } catch (error: any) {
    console.error('❌ Error sending welcome email:', error.message);
    // Don't throw error for welcome email - it's not critical
  }
}

/**
 * Send account deletion confirmation email
 */
export async function sendAccountDeletionEmail(email: string, name: string): Promise<void> {
  console.log(`📧 Sending account deletion email to: ${email}`);
  const transporter = getTransporter();
  
  const mailOptions = {
    from: process.env.MAIL_FROM || 'Berlin Student Portal <noreply@example.invalid>',
    to: email,
    subject: 'Your Berlin Student Portal Account Has Been Deleted',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          .info-box { background-color: #fff; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Account Deleted</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>Your Berlin Student Portal account has been permanently deleted as per your request.</p>
            
            <div class="info-box">
              <p><strong>What was deleted:</strong></p>
              <ul>
                <li>Your account and profile information</li>
                <li>All your questions and posts</li>
                <li>All your replies and comments</li>
                <li>All uploaded files and attachments</li>
                <li>Your verification records</li>
              </ul>
            </div>
            
            <p>We're sorry to see you go! If you deleted your account by mistake or change your mind, you can always create a new account at any time.</p>
            
            <p>If you have any questions or feedback about your experience, please feel free to reach out to us.</p>
            
            <p>Thank you for being part of our community!<br>Berlin Student Portal Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Berlin Student Portal. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Hello ${name},

Your Berlin Student Portal account has been permanently deleted as per your request.

What was deleted:
- Your account and profile information
- All your questions and posts
- All your replies and comments
- All uploaded files and attachments
- Your verification records

We're sorry to see you go! If you deleted your account by mistake or change your mind, you can always create a new account at any time.

Thank you for being part of our community!
Berlin Student Portal Team

© ${new Date().getFullYear()} Berlin Student Portal. All rights reserved.
    `.trim(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Account deletion email sent successfully!');
    console.log('   Message ID:', info.messageId);
  } catch (error: any) {
    console.error('❌ Error sending account deletion email:', error.message);
    // Don't throw error - deletion already completed
  }
}

/**
 * Test email connection
 */
export async function testEmailConnection(): Promise<boolean> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('✅ Email connection test successful!');
    return true;
  } catch (error: any) {
    console.error('❌ Email connection test failed:', error.message);
    return false;
  }
}
