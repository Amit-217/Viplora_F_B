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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const status = req.query.status as string; // 'approved' or 'applications'
    const skip = (page - 1) * limit;

    let query: any = {};
    if (status === 'approved') {
      query.status = 'approved';
    } else if (status === 'applications') {
      query.status = { $ne: 'approved' };
    }

    const total = await VolunteerApplication.countDocuments(query);
    const applications = await VolunteerApplication.find(query)
      .populate('userId', 'customId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      applications,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
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
      // Update User role and customId to Volunteer
      const { generateCustomId } = await import('../../utils/idGenerator.js');
      const customId = await generateCustomId(UserRole.VOLUNTEER);
      await User.findByIdAndUpdate(application.userId, { role: UserRole.VOLUNTEER, customId });
    }

    res.json({ message: `Application ${status}`, application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const application = await VolunteerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const application = await VolunteerApplication.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application updated successfully', application });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteApplication = async (req: Request, res: Response) => {
  try {
    const application = await VolunteerApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Cascade User cleanup triggers if available overlays frames thresholds flawless correctly trigger layouts
    if (application.userId) {
      const User = (await import('../user/user.model.js')).default;
      const linkedUser = await User.findById(application.userId);
      if (linkedUser && linkedUser.role !== 'admin') {
        await User.findByIdAndDelete(application.userId);
      }
    }

    await VolunteerApplication.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application and linked user deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
