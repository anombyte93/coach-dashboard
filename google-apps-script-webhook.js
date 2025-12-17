/**
 * Google Apps Script - Coach Dashboard Email Webhook
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Paste this code
 * 4. Click Deploy > New deployment
 * 5. Select "Web app"
 * 6. Set "Execute as" to your account
 * 7. Set "Who has access" to "Anyone"
 * 8. Click Deploy and copy the URL
 * 9. Update NOTIFICATION_WEBHOOK in index.html with your URL
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const recipient = data.to || 'rhys@ironbark.ai';
    const subject = data.subject || 'Coach Dashboard Notification';
    const body = data.body || 'New response submitted';

    // Send email
    GmailApp.sendEmail(recipient, subject, body, {
      name: 'Coach Dashboard',
      replyTo: recipient
    });

    // Log for debugging
    console.log('Email sent to:', recipient);
    console.log('Subject:', subject);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Email sent' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Coach Dashboard webhook is active',
      usage: 'POST JSON with: to, subject, body'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function
function testEmail() {
  const testData = {
    to: 'rhys@ironbark.ai',
    subject: 'Test: Coach Dashboard Webhook',
    body: 'This is a test email from the Coach Dashboard webhook.'
  };

  GmailApp.sendEmail(testData.to, testData.subject, testData.body, {
    name: 'Coach Dashboard'
  });

  console.log('Test email sent!');
}
