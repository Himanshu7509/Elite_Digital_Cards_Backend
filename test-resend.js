import { Resend } from 'resend';

console.log('Resend imported successfully');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

console.log('Resend instance:', resend ? 'Created' : 'Not created');

if (resend) {
  console.log('Resend API key is set');
} else {
  console.log('Resend API key is not set');
}