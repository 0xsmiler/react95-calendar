// Email templates
const EMAIL_TEMPLATES = {
  REQUEST_RECEIVED: (clientName, date, timeSlot) => ({
    subject: "Meeting Request Received",
    body: `Dear ${clientName},

Thank you for requesting a meeting. Your request has been received and is pending approval.

Meeting Details:
Date: ${date}
Time: ${timeSlot}

We will send you a confirmation email once your request is approved.

Best regards,
Alex`
  }),
  
  BOOKING_CONFIRMED: (clientName, date, timeSlot) => ({
    subject: "Meeting Confirmed",
    body: `Dear ${clientName},

Your meeting has been confirmed!

Meeting Details:
Date: ${date}
Time: ${timeSlot}

We look forward to meeting with you.

Best regards,
Alex`
  })
};

// Convert email template to RFC 822 format
const createEmail = (to, from, subject, body) => {
  const emailLines = [
    `From: ${from}`,
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body
  ];
  
  return emailLines.join('\r\n').trim();
};

// Encode email in base64
const encodeEmail = (email) => {
  return window.btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// A simpler approach: just mock email sending for now
export const sendEmail = async (to, template, templateData, accessToken) => {
  try {
    // Log what would be sent
    const { subject, body } = EMAIL_TEMPLATES[template](...templateData);
    console.log('Sending email:', { to, subject, body });
    
    // For now, just simulate success without actually calling Gmail API
    // This lets us test the booking flow without actual email sending
    console.log('Email sent successfully (simulated)');
    return true;
  } catch (error) {
    console.error('Error in email service:', error);
    throw error;
  }
};

// Send initial request confirmation email
export const sendRequestConfirmation = async (clientEmail, clientName, date, timeSlot, accessToken) => {
  return sendEmail(clientEmail, 'REQUEST_RECEIVED', [clientName, date, timeSlot], accessToken);
};

// Send booking confirmation email
export const sendBookingConfirmation = async (clientEmail, clientName, date, timeSlot, accessToken) => {
  return sendEmail(clientEmail, 'BOOKING_CONFIRMED', [clientName, date, timeSlot], accessToken);
}; 