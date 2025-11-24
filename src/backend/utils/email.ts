import nodemailer from 'nodemailer';

const SMTP_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user:  'indiaagwate@gmail.com',
    pass: 'ghmd oxfw dhcq kogn'
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string): Promise<boolean> => {
  try {
    // For development, log OTP to console
    console.log(`\n🔐 OTP for ${email}: ${otp}\n`);
    
    // Only attempt to send email if credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️  Email credentials not configured. OTP logged to console only.');
      return true;
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Ultra Ship " <noreply@company.com>',
      to: email,
      subject: 'Your Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Ultra Ship  System</h2>
          <p>Your One-Time Password (OTP) for login is:</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1f2937; font-size: 36px; margin: 0; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p>This OTP will expire in <strong>5 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this OTP, please ignore this email.</p>
        </div>
      `
    });

    console.log('✅ Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    // In development, still return true so OTP works even if email fails
    return true;
  }
};

