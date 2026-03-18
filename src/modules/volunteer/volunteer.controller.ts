import { Request, Response } from 'express';
import VolunteerApplication from './volunteer.model.js';
import User, { UserRole } from '../user/user.model.js';

interface AuthRequest extends Request {
  user?: any;
}

export const applyAsVolunteer = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;

    // Check if already applied
    const existing = await VolunteerApplication.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted an application' });
    }

    const application = await VolunteerApplication.create({
      ...req.body,
      userId,
      email: req.user.email,
      fullName: req.user.name
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const applications = await VolunteerApplication.find().populate('userId', 'name email customId');
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
