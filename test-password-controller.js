import dotenv from 'dotenv';
dotenv.config();

import { forgotPassword, verifyOTP, resetPassword, resendOTP } from './src/controllers/password.controller.js';

console.log('Password controller functions loaded successfully');
console.log('forgotPassword:', typeof forgotPassword);
console.log('verifyOTP:', typeof verifyOTP);
console.log('resetPassword:', typeof resetPassword);
console.log('resendOTP:', typeof resendOTP);