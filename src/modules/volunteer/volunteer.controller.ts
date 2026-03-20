import { Request, Response } from 'express';
import VolunteerApplication from './volunteer.model.js';
import User, { UserRole } from '../user/user.model.js';

interface AuthRequest extends Request {
  user?: any;
}

export const applyAsVolunteer = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    // Check if already applied
    const existing = await VolunteerApplication.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An application with this email already exists' });
    }

    const application = await VolunteerApplication.create({
      ...req.body,
      fullName: name || req.body.fullName
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await VolunteerApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const application = await VolunteerApplication.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (application && status === 'approved') {
      // Update User role to Volunteer
      await User.findByIdAndUpdate(application.userId, { role: UserRole.VOLUNTEER });
    }

    res.json({ message: `Application ${status}`, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
