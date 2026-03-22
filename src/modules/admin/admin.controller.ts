import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../user/user.model.js';
import Donation from '../donation/donation.model.js';
import Program from '../program/program.model.js';
import { generateCustomId } from '../../utils/idGenerator.js';
import VolunteerApplication from '../volunteer/volunteer.model.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRaised = totalDonations.length > 0 ? totalDonations[0].total : 0;

    const activePrograms = await Program.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: UserRole.VOLUNTEER });
    const pendingApplications = await VolunteerApplication.countDocuments({ status: 'pending' });
    const totalApplications = await VolunteerApplication.countDocuments();
    const monthlyGrowth = "+12%"; 

    res.json({
      stats: [
        { label: 'Total Raised', value: `₹${(totalRaised / 100000).toFixed(2)}L`, amount: totalRaised },
        { label: 'Active Programs', value: activePrograms.toString() },
        { label: 'Volunteers', value: totalVolunteers.toString() },
        { label: 'Pending Applications', value: pendingApplications.toString() },
        { label: 'Total Applications', value: totalApplications.toString() },
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

export const getAllAdmins = async (req: Request, res: Response) => {
  try {
    const admins = await User.find({ role: UserRole.ADMIN }).select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'amitchandure123s@gmail.com';
    if (admin.email === superAdminEmail) {
      return res.status(403).json({ message: 'Super Admin account cannot be deleted for security safety' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
