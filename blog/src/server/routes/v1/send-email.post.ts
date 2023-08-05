import { defineEventHandler, readBody, createError } from 'h3';
import { MailtrapClient } from 'mailtrap';
import 'dotenv/config';

export default defineEventHandler(async event => {
  const body = await readBody(event);
  const { name, email, message } = body;
  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name, email and message are required',
    });
  }

  if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid email',
    });
  }

  const TOKEN = process.env['MAIL_TOKEN'] || '';
  const ENDPOINT = process.env['MAIL_ENDPOINT'] || '';

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  const sender = {
    email: 'mailtrap@mrrobot.dev',
    name: 'Mr. Robot',
  };
  const recipients = [
    {
      email: 'luish.castroc@gmail.com',
    },
  ];

  try {
    const sendEmail = await client.send({
      from: sender,
      to: recipients,
      template_uuid: process.env['MAIL_TEMPLATE_ID'] || '',
      template_variables: { name, email, message },
    });
    if (sendEmail.success) {
      return {
        statusCode: 200,
        message: 'Email sent successfully',
      };
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
