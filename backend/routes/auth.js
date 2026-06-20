const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const JWT_SECRET = process.env.JWT_SECRET || 'SmartCartSecretKey123!';

// ROUTE 1: Create a user: POST "/api/auth/register". No login required
router.post('/register', async (req, res) => {
  let success = false;
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success, error: 'Sorry a user with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: secPassword,
    });

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE 2: Authenticate a user: POST "/api/auth/login". No login required
router.post('/login', async (req, res) => {
  let success = false;
  try {
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ success, error: 'Please try to login with correct credentials' });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authToken });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE 3: Get loggedin User details: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// ROUTE 4: Forgot Password: POST "/api/auth/forgot-password". No login required
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User with this email does not exist.' });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry
    await user.save();

    // Create reset URL pointing to React frontend route
    const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

    // Mail transport
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER || '',
        pass: process.env.EMAIL_PASS || '',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@hungryapp.com',
      to: user.email,
      subject: 'HungryApp Password Reset Link',
      text: `Hello,\n\nYou requested a password reset for your HungryApp account.\n\nPlease click the following link, or paste it into your browser to complete the process:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n`
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Password reset link sent to your email.' });
    } else {
      console.log('----------------------------------------------------');
      console.log('📬  EMAIL SIMULATION: EMAIL CREDENTIALS NOT CONFIGURED IN .env');
      console.log('To send real emails, set EMAIL_USER and EMAIL_PASS in your backend .env file.');
      console.log('Sending to: ' + user.email);
      console.log('Reset Link: ' + resetUrl);
      console.log('----------------------------------------------------');
      res.json({ 
        success: true, 
        message: 'Password reset link simulated in development mode! Check your backend terminal console for the link.' 
      });
    }
  } catch (error) {
    console.error('Error in forgot-password:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 5: Reset Password: POST "/api/auth/reset-password". No login required
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Password reset token is invalid or has expired.' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset successfully! You can now log in.' });
  } catch (error) {
    console.error('Error in reset-password:', error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// ROUTE 6: Get all registered users: GET "/api/auth/all-users". No login required (debugging only)
router.get('/all-users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
