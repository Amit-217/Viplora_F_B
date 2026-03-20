import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { UserRole } from '../user/user.model.js';
import { generateCustomId } from '../../utils/idGenerator.js';
import { sendOTPEmail } from '../../utils/emailService.js';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_12345', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customId = await generateCustomId(role || UserRole.USER);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = await User.create({
      customId,
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.USER,
      otp,
      otpExpires
    });

    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: 'Registration successful. Please verify your email with the OTP sent.',
      email: user.email
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully',
      token: generateToken(user._id.toString()),
      user: {
        id: user.customId,
        name: user.name,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password!))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      res.json({
        token: generateToken(user._id.toString()),
        user: {
          id: user.customId,
          name: user.name,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email has already been verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'A new 6-digit OTP has been sent to your email.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@example.com';
    const adminPass = process.env.SUPER_ADMIN_PASSWORD || 'change_me';

    if (email === adminEmail && password === adminPass) {
      const token = jwt.sign(
        { id: 'admin_env', role: 'admin' }, 
        process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_key_12345', 
        { expiresIn: '30d' }
      );
      return res.json({
        token,
        user: { id: 'admin_env', name: 'Super Admin', role: 'admin', email: adminEmail }
      });
    }

    const user = await User.findOne({ email, role: UserRole.ADMIN });
    if (user && (await bcrypt.compare(password, user.password!))) {
      const token = generateToken(user._id.toString());
      return res.json({
        token,
        user: { id: user.customId, name: user.name, role: user.role, email: user.email }
      });
    }

    return res.status(401).json({ message: 'Invalid admin credentials' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpires = otpExpires as any;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({ message: 'Password reset OTP sent to your email.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: new Date() } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
