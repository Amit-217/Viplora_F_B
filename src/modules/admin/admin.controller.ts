import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../user/user.model.js';
import Donation from '../donation/donation.model.js';
import Program from '../program/program.model.js';
import { generateCustomId } from '../../utils/idGenerator.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRaised = totalDonations.length > 0 ? totalDonations[0].total : 0;

    const activePrograms = await Program.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: UserRole.VOLUNTEER });
    const monthlyGrowth = "+12%"; // You could calculate this based on last month's data

    res.json({
      stats: [
        { label: 'Total Raised', value: `₹${(totalRaised / 100000).toFixed(2)}L`, amount: totalRaised },
        { label: 'Active Programs', value: activePrograms.toString() },
        { label: 'Volunteers', value: totalVolunteers.toString() },
        { label: 'Monthly Growth', value: monthlyGrowth },
      ]
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const donations = await Donation.find().populate('programId', 'title').sort({ createdAt: -1 });
    res.json(donations);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customId = await generateCustomId(UserRole.ADMIN);

    const admin = await User.create({
      customId,
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true // Admins added by superadmin are auto-verified
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin: {
        id: admin.customId,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
