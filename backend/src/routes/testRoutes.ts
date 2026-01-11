import express from 'express';
import { testEmailConnection, sendOtpEmail } from '../services/emailService';
import { generateOtp } from '../utils/otp';

const router = express.Router();

/**
 * Test email connection
 * GET /api/test/email-connection
 */
router.get('/email-connection', async (req, res) => {
  try {
    const isConnected = await testEmailConnection();
    
    if (isConnected) {
      res.json({
        success: true,
        message: 'Email connection is working!',
        smtp: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Email connection failed. Check backend logs for details.',
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Send test OTP email
 * POST /api/test/send-otp
 * Body: { email: string, name?: string }
 */
router.post('/send-otp', async (req, res) => {
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Generate test OTP
    const testOtp = generateOtp();
    const testName = name || 'Test User';

    console.log('\n🧪 TEST EMAIL REQUEST:');
    console.log('   To:', email);
    console.log('   Name:', testName);
    console.log('   OTP:', testOtp);
    console.log('\n');

    // Send test email
    await sendOtpEmail(email, testOtp, testName);

    res.json({
      success: true,
      message: `Test OTP email sent to ${email}`,
      data: {
        email,
        otp: testOtp,
        note: 'Check your email inbox (and spam folder)',
      },
    });
  } catch (error: any) {
    console.error('Test email failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
