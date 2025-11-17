import dotenv from 'dotenv';
dotenv.config();

console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL ? 'Set' : 'Not set');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');