import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'apikey',
      pass: process.env.SMTP_PASS || process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: `"Architectural Marketplace" <${process.env.SMTP_FROM || 'noreply@architectural.com'}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${options.to}`);
  } catch (error) {
    console.error('❌ Email send failed:', error);
    throw new Error('Email could not be sent');
  }
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    text: `Hi ${user.name},\n\nYou requested a password reset. Click the link below:\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #111827; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p style="color: #6B7280; font-size: 14px;">This link will expire in 15 minutes.</p>
      </div>
    `,
  });
};

export const sendOrderConfirmationEmail = async (user, order) => {
  await sendEmail({
    to: user.email,
    subject: `Order Confirmation #${order._id?.toString().slice(-6).toUpperCase()}`,
    text: `Hi ${user.name},\n\nYour order has been confirmed. Order ID: ${order._id}\nTotal: $${order.totalPrice}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">Order Confirmed</h2>
        <p>Hi ${user.name},</p>
        <p>Your order has been placed successfully.</p>
        <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Order ID:</strong> #${order._id?.toString().slice(-6).toUpperCase()}</p>
          <p><strong>Total:</strong> $${order.totalPrice?.toLocaleString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>
      </div>
    `,
  });
};

export const sendMerchantOnboardingEmail = async (user) => {
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Architectural Marketplace',
    text: `Welcome ${user.name}! Your merchant account is now active. Start adding products to your store.`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">Welcome to the Platform</h2>
        <p>Hi ${user.name},</p>
        <p>Your merchant account is now active. Start adding products to your store and reach customers worldwide.</p>
        <a href="${process.env.FRONTEND_URL}/admin" style="display: inline-block; padding: 12px 24px; background: #111827; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Go to Dashboard</a>
      </div>
    `,
  });
};

export default sendEmail;
