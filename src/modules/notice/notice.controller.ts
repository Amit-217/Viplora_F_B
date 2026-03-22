import { Request, Response } from 'express';
import Notice from './notice.model.js';
import User from '../user/user.model.js';
import { UserRole } from '../user/user.model.js';
import { sendNoticeEmail } from '../../utils/emailService.js';

export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, message, link, targetAudience, isPinned } = req.body;

    const notice = await Notice.create({
      title,
      message,
      link,
      targetAudience: targetAudience || 'volunteer',
      isPinned: isPinned || false
    });

    // Trigger Bulk Email
    const volunteers = await User.find({ role: UserRole.VOLUNTEER });
    for (const vol of volunteers) {
      if (vol.email) {
        sendNoticeEmail(vol.email, title, message, link).catch(err => console.error(`Failed to send mail to ${vol.email}:`, err));
      }
    }

    res.status(201).json(notice);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotices = async (req: Request, res: Response) => {
  try {
    const notices = await Notice.find().sort({ isPinned: -1, createdAt: -1 });
    res.json(notices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
