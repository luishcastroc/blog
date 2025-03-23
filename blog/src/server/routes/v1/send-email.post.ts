import { createError, defineEventHandler, readBody } from 'h3';
import { MailtrapClient } from 'mailtrap';
import 'dotenv/config';

// Extract configuration constants
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const SENDER = {
  email: process.env.SENDER_EMAIL || 'mailtrap@mrrobot.dev',
  name: process.env.SENDER_NAME || 'Mr. Robot',
};
const RECIPIENT_EMAIL =
  process.env.RECIPIENT_EMAIL || 'luish.castroc@gmail.com';

/**
 * Sends a contact email using Mailtrap
 */
async function sendContactEmail(name: string, email: string, message: string) {
  const token = process.env.MAIL_TOKEN;
  if (!token) {
    throw new Error('Mail token not configured');
  }

  const templateId = process.env.MAIL_TEMPLATE_ID;
  if (!templateId) {
    throw new Error('Mail template ID not configured');
  }

  const client = new MailtrapClient({ token });

  const recipients = [{ email: RECIPIENT_EMAIL }];

  const response = await client.send({
    from: SENDER,
    to: recipients,
    template_uuid: templateId,
    template_variables: { name, email, message },
  });

  return response;
}

export default defineEventHandler(async event => {
  try {
    // Input validation
    const body = await readBody(event);
    const { name, email, message } = body;

    if (!name || !email || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, email and message are required',
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format',
      });
    }

    // Email sending
    const emailResponse = await sendContactEmail(name, email, message);

    if (!emailResponse.success) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send email',
      });
    }

    return {
      statusCode: 200,
      message: 'Email sent successfully',
    };
  } catch (error) {
    if (error.statusCode) {
      throw error; // Re-throw HTTP errors
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Email sending failed: ${error.message}`,
    });
  }
});
