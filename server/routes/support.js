const express = require('express');
const router = express.Router();
const { sendEmail } = require('../utils/sendEmail');

// Support email recipient
const SUPPORT_EMAIL = 'abhiself28@gmail.com';

// @desc    Submit support request
// @route   POST /api/support/submit
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, issueType, transactionId, bookingDate, message } = req.body;

    // Validate required fields
    if (!name || !email || !issueType || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Format issue type for display
    const issueTypeLabels = {
      payment_failure: '💳 Payment Failed / Money Deducted',
      meeting_link: '🔗 Meeting Link Issue',
      reschedule: '📅 Reschedule Request',
      other: '❓ Other Issue'
    };

    const issueLabel = issueTypeLabels[issueType] || issueType;

    // Email to support team
    const supportEmailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #0f172a;">
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #f59e0b 100%); padding: 25px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🆘 New Support Request</h1>
          </div>

          <!-- Issue Type Badge -->
          <div style="padding: 20px; text-align: center;">
            <span style="background: #1e293b; color: #f1f5f9; padding: 10px 20px; border-radius: 20px; font-size: 14px; border: 1px solid #334155;">
              ${issueLabel}
            </span>
          </div>

          <!-- User Details -->
          <div style="padding: 0 25px 25px 25px;">
            <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #6366f1;">
              <h3 style="color: #6366f1; margin: 0 0 15px 0;">👤 User Details</h3>
              <p style="margin: 8px 0; color: #f1f5f9;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #f1f5f9;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #22d3ee;">${email}</a></p>
              ${phone ? `<p style="margin: 8px 0; color: #f1f5f9;"><strong>Phone:</strong> <a href="tel:${phone}" style="color: #22d3ee;">${phone}</a></p>` : ''}
            </div>

            ${transactionId ? `
            <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 15px; border-left: 4px solid #ef4444;">
              <h3 style="color: #ef4444; margin: 0 0 15px 0;">💳 Transaction Details</h3>
              <p style="margin: 8px 0; color: #f1f5f9;"><strong>Transaction ID:</strong> <code style="background: #334155; padding: 2px 8px; border-radius: 4px;">${transactionId}</code></p>
              ${bookingDate ? `<p style="margin: 8px 0; color: #f1f5f9;"><strong>Booking Date:</strong> ${new Date(bookingDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
            </div>
            ` : ''}

            <div style="background: #1e293b; border-radius: 12px; padding: 20px; border-left: 4px solid #10b981;">
              <h3 style="color: #10b981; margin: 0 0 15px 0;">📝 Issue Description</h3>
              <p style="margin: 0; color: #f1f5f9; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div style="padding: 0 25px 25px 25px;">
            <a href="mailto:${email}?subject=Re: CollegeMate Support - ${issueLabel}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">
              Reply to User
            </a>
          </div>

          <!-- Footer -->
          <div style="background: #1e293b; padding: 15px; text-align: center; border-top: 1px solid #334155;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
              CollegeMate Support System | ${new Date().toLocaleString('en-IN')}
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    // Send email to support
    await sendEmail({
      to: SUPPORT_EMAIL,
      subject: `🆘 Support Request: ${issueLabel} - ${name}`,
      html: supportEmailHtml
    });

    // Confirmation email to user
    const userConfirmationHtml = `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; background-color: #0f172a;">
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9;">
          
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">CollegeMate</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Support Request Received</p>
          </div>

          <div style="padding: 30px;">
            <p style="color: #f1f5f9; font-size: 16px;">Hi ${name},</p>
            <p style="color: #94a3b8; line-height: 1.6;">
              Thank you for reaching out to us. We have received your support request regarding <strong style="color: #f1f5f9;">${issueLabel}</strong>.
            </p>
            <p style="color: #94a3b8; line-height: 1.6;">
              Our team will review your request and get back to you within <strong style="color: #22d3ee;">24-48 hours</strong>.
            </p>
            
            <div style="background: #1e293b; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">Your Issue:</p>
              <p style="color: #f1f5f9; margin: 0; line-height: 1.6;">${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</p>
            </div>

            <p style="color: #94a3b8; line-height: 1.6;">
              If you have any additional information to share, please reply to this email.
            </p>
          </div>

          <div style="background: #1e293b; padding: 20px; text-align: center; border-top: 1px solid #334155;">
            <p style="color: #64748b; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} CollegeMate. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: '✅ Support Request Received - CollegeMate',
      html: userConfirmationHtml
    });

    res.json({
      success: true,
      message: 'Support request submitted successfully'
    });
  } catch (error) {
    console.error('Support form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit support request. Please try again.'
    });
  }
});

module.exports = router;
