const nodemailer = require('nodemailer');

let transporter = null;

// Initialize transporter only if email credentials are provided
const getTransporter = () => {
  if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  return transporter;
};

const sendEmail = async (options) => {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    console.log('Email not configured, skipping:', options.subject);
    return false;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `CollegeMate <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html
  };

  try {
    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email error:', error.message);
    return false;
  }
};

// Booking & Payment confirmation email to user
const sendBookingConfirmation = async (user, booking, mentor) => {
  const date = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatTimeSlot = (slot) => {
    if (!slot) return '';
    const [start, end] = slot.split('-');
    const formatTime = (time) => {
      const [hours] = time.split(':');
      const h = parseInt(hours);
      if (h === 0 || h === 24) return '12:00 AM';
      if (h === 12) return '12:00 PM';
      return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a;">
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #6366f1 100%); padding: 30px; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 10px;">✅</div>
          <h1 style="color: white; margin: 0; font-size: 28px;">Payment Successful!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Your session is confirmed</p>
        </div>

        <!-- Thank You Message -->
        <div style="padding: 30px; text-align: center; background: #1e293b;">
          <p style="color: #f1f5f9; font-size: 18px; margin: 0;">
            Thank you, <strong>${user.name}</strong>! 🎉
          </p>
          <p style="color: #94a3b8; margin: 10px 0 0 0;">
            We've received your payment and your mentorship session is now confirmed.
          </p>
        </div>

        <!-- Booking Details Card -->
        <div style="padding: 30px;">
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; padding: 25px; border: 1px solid #475569;">
            <h3 style="color: #22d3ee; margin: 0 0 20px 0; font-size: 18px; text-align: center;">
              📋 Session Details
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #94a3b8;">Booking ID</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #f1f5f9; text-align: right; font-family: monospace;">${booking._id}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #94a3b8;">Mentor</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #f1f5f9; text-align: right; font-weight: bold;">${mentor.name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #94a3b8;">📅 Date</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #f1f5f9; text-align: right;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #94a3b8;">⏰ Time</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #f1f5f9; text-align: right;">${formatTimeSlot(booking.timeSlot)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #94a3b8;">Duration</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #475569; color: #f1f5f9; text-align: right;">1 Hour</td>
              </tr>
            </table>

            <!-- Payment Info -->
            <div style="background: #10b981; border-radius: 12px; padding: 15px; margin-top: 20px; text-align: center;">
              <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px;">AMOUNT PAID</p>
              <p style="color: white; margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">₹${booking.amount}</p>
              ${booking.paymentId ? `<p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 11px;">Payment ID: ${booking.paymentId}</p>` : ''}
            </div>
          </div>
        </div>

        <!-- Important Notice -->
        <div style="padding: 0 30px 30px 30px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 25px; text-align: center;">
            <div style="font-size: 30px; margin-bottom: 10px;">🔗</div>
            <h3 style="color: white; margin: 0 0 10px 0;">Meeting Link</h3>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">
              You will receive the <strong>Google Meet / Zoom link</strong><br>
              <span style="font-size: 18px; font-weight: bold;">1 hour before</span> your scheduled session.
            </p>
            <p style="color: rgba(255,255,255,0.7); margin: 15px 0 0 0; font-size: 12px;">
              Please check your email and be ready 5 minutes early!
            </p>
          </div>
        </div>

        <!-- What to Prepare -->
        <div style="padding: 0 30px 30px 30px;">
          <div style="background: #1e293b; border-radius: 16px; padding: 25px; border: 1px solid #334155;">
            <h3 style="color: #f1f5f9; margin: 0 0 15px 0; text-align: center;">📝 Prepare for Your Session</h3>
            <ul style="color: #94a3b8; margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>List down your questions and topics to discuss</li>
              <li>Have your resume/portfolio ready if needed</li>
              <li>Ensure stable internet connection</li>
              <li>Find a quiet place for the call</li>
              <li>Keep a notebook for taking notes</li>
            </ul>
          </div>
        </div>

        <!-- CTA -->
        <div style="padding: 0 30px 30px 30px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%); color: white; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">
            View My Bookings →
          </a>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 25px; text-align: center; border-top: 1px solid #334155;">
          <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">
            Questions? Reply to this email or contact us at
          </p>
          <p style="color: #6366f1; margin: 0 0 15px 0; font-size: 14px;">
            support@collegemate.in
          </p>
          <div style="margin-bottom: 15px;">
            <a href="https://linkedin.com" style="color: #6366f1; text-decoration: none; margin: 0 10px; font-size: 13px;">LinkedIn</a>
            <a href="https://instagram.com" style="color: #6366f1; text-decoration: none; margin: 0 10px; font-size: 13px;">Instagram</a>
          </div>
          <p style="color: #475569; margin: 0; font-size: 11px;">
            © ${new Date().getFullYear()} CollegeMate. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '✅ Payment Received - Your CollegeMate Session is Confirmed!',
    html
  });
};

// New booking notification to admin
const sendAdminNotification = async (user, booking, mentor) => {
  const date = new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formatTimeSlot = (slot) => {
    if (!slot) return '';
    const [start, end] = slot.split('-');
    const formatTime = (time) => {
      const [hours] = time.split(':');
      const h = parseInt(hours);
      if (h === 0 || h === 24) return '12:00 AM';
      if (h === 12) return '12:00 PM';
      return h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin: 0; padding: 0; background-color: #0f172a;">
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #10b981 100%); padding: 25px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">💰 New Booking Received!</h1>
        </div>

        <!-- User Details -->
        <div style="padding: 25px;">
          <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #6366f1;">
            <h3 style="color: #6366f1; margin: 0 0 15px 0;">👤 Customer Details</h3>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Name:</strong> ${user.name}</p>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Email:</strong> <a href="mailto:${user.email}" style="color: #22d3ee;">${user.email}</a></p>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Phone:</strong> <a href="tel:${user.phone}" style="color: #22d3ee;">${user.phone}</a></p>
          </div>

          <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #10b981;">
            <h3 style="color: #10b981; margin: 0 0 15px 0;">📅 Session Details</h3>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Mentor:</strong> ${mentor.name}</p>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Time:</strong> ${formatTimeSlot(booking.timeSlot)}</p>
            <p style="margin: 8px 0; color: #f1f5f9;"><strong>Booking ID:</strong> <code style="background: #334155; padding: 2px 6px; border-radius: 4px;">${booking._id}</code></p>
          </div>

          <div style="background: #10b981; border-radius: 12px; padding: 20px; text-align: center;">
            <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 12px;">PAYMENT RECEIVED</p>
            <p style="color: white; margin: 5px 0; font-size: 32px; font-weight: bold;">₹${booking.amount}</p>
            <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 11px;">Payment ID: ${booking.paymentId || 'N/A'}</p>
          </div>
        </div>

        <!-- Action -->
        <div style="padding: 0 25px 25px 25px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/admin" style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            View in Admin Dashboard →
          </a>
        </div>

      </div>
    </body>
    </html>
  `;

  // Send to both admins
  const adminEmails = [
    process.env.ADMIN1_EMAIL || 'ayushk2k23@gmail.com',
    process.env.ADMIN2_EMAIL || 'abhiself28@gmail.com'
  ].join(', ');

  return sendEmail({
    to: adminEmails,
    subject: `💰 New Booking - ${user.name} - ₹${booking.amount}`,
    html
  });
};

// Password reset email
const sendPasswordReset = async (user, resetUrl) => {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9; padding: 30px; border-radius: 10px;">
      <h2 style="color: #6366f1;">🔐 Password Reset Request</h2>
      
      <p>Hi ${user.name},</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Reset Password
        </a>
      </div>
      
      <p style="color: #94a3b8;">This link will expire in 10 minutes.</p>
      <p style="color: #94a3b8;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Password Reset - CollegeMate',
    html
  });
};

// Welcome email for new users
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a;">
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f1f5f9; padding: 0;">
        
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%); padding: 40px 30px; text-align: center; border-radius: 0 0 50px 50px;">
          <h1 style="color: white; margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🚀 CollegeMate</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your Journey to Success Starts Here</p>
        </div>

        <!-- Welcome Message -->
        <div style="padding: 40px 30px; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
          <h2 style="color: #22d3ee; margin: 0 0 10px 0; font-size: 28px;">Welcome, ${user.name}!</h2>
          <p style="color: #94a3b8; font-size: 16px; line-height: 1.6;">
            We're thrilled to have you join the CollegeMate family! You've just taken the first step towards transforming your tech career.
          </p>
        </div>

        <!-- Features Section -->
        <div style="padding: 0 30px 30px 30px;">
          <div style="background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 16px; padding: 25px;">
            <h3 style="color: #f1f5f9; margin: 0 0 20px 0; text-align: center;">What You Can Do Now</h3>
            
            <div style="display: flex; margin-bottom: 15px;">
              <div style="background: #6366f1; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                <span style="color: white; font-size: 18px;">📅</span>
              </div>
              <div>
                <p style="color: #f1f5f9; margin: 0; font-weight: 600;">Book 1:1 Sessions</p>
                <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Get personalized guidance from expert mentors</p>
              </div>
            </div>

            <div style="display: flex; margin-bottom: 15px;">
              <div style="background: #8b5cf6; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                <span style="color: white; font-size: 18px;">💡</span>
              </div>
              <div>
                <p style="color: #f1f5f9; margin: 0; font-weight: 600;">Career Roadmap</p>
                <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Get a clear path to achieve your goals</p>
              </div>
            </div>

            <div style="display: flex;">
              <div style="background: #22d3ee; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">
                <span style="color: white; font-size: 18px;">🎯</span>
              </div>
              <div>
                <p style="color: #f1f5f9; margin: 0; font-weight: 600;">Interview Prep</p>
                <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px;">Ace your technical interviews with confidence</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Offer -->
        <div style="padding: 0 30px 30px 30px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; padding: 25px; text-align: center;">
            <p style="color: rgba(255,255,255,0.9); margin: 0 0 5px 0; font-size: 14px;">SPECIAL OFFER</p>
            <p style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
              <span style="text-decoration: line-through; opacity: 0.7;">₹500</span> 
              <span style="color: #22d3ee;"> ₹200</span> / session
            </p>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Limited time offer for new members!</p>
          </div>
        </div>

        <!-- CTA Button -->
        <div style="padding: 0 30px 40px 30px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="display: inline-block; background: linear-gradient(135deg, #22d3ee 0%, #6366f1 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);">
            Book Your First Session →
          </a>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 30px; text-align: center; border-top: 1px solid #334155;">
          <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Follow us for tips & updates</p>
          <div style="margin-bottom: 20px;">
            <a href="https://linkedin.com" style="color: #6366f1; text-decoration: none; margin: 0 10px;">LinkedIn</a>
            <a href="https://instagram.com" style="color: #6366f1; text-decoration: none; margin: 0 10px;">Instagram</a>
          </div>
          <p style="color: #475569; margin: 0; font-size: 12px;">
            © ${new Date().getFullYear()} CollegeMate. All rights reserved.<br>
            You received this email because you signed up at CollegeMate.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🚀 Welcome to CollegeMate - Your Journey Begins!',
    html
  });
};

// Email OTP verification
const sendEmailOtp = async (user, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0f172a;">
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Verify Your Email</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">CollegeMate Account Verification</p>
        </div>

        <!-- OTP Section -->
        <div style="padding: 40px 30px; text-align: center;">
          <p style="color: #f1f5f9; font-size: 16px; margin: 0 0 10px 0;">
            Hi ${user.name},
          </p>
          <p style="color: #94a3b8; font-size: 14px; margin: 0 0 30px 0;">
            Use the following OTP to verify your email address:
          </p>
          
          <!-- OTP Box -->
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 16px; padding: 30px; display: inline-block; border: 2px solid #6366f1;">
            <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Your OTP Code</p>
            <p style="color: #22d3ee; margin: 0; font-size: 48px; font-weight: bold; letter-spacing: 8px; font-family: monospace;">${otp}</p>
          </div>
          
          <p style="color: #ef4444; font-size: 14px; margin: 30px 0 0 0;">
            ⏰ This OTP expires in <strong>10 minutes</strong>
          </p>
        </div>

        <!-- Warning -->
        <div style="padding: 0 30px 30px 30px;">
          <div style="background: #1e293b; border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
            <p style="color: #f59e0b; margin: 0 0 5px 0; font-weight: bold;">⚠️ Security Notice</p>
            <p style="color: #94a3b8; margin: 0; font-size: 13px;">
              Never share this OTP with anyone. CollegeMate will never ask for your OTP via phone or message.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #0f172a; padding: 25px; text-align: center; border-top: 1px solid #334155;">
          <p style="color: #64748b; margin: 0; font-size: 12px;">
            If you didn't request this verification, please ignore this email.
          </p>
          <p style="color: #475569; margin: 10px 0 0 0; font-size: 11px;">
            © ${new Date().getFullYear()} CollegeMate. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: '🔐 Verify Your Email - CollegeMate OTP',
    html
  });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendAdminNotification,
  sendPasswordReset,
  sendWelcomeEmail,
  sendEmailOtp
};
