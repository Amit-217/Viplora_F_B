import { Request, Response } from 'express';
import Activity from './activity.model.js';

export const createActivity = async (req: Request, res: Response) => {
  try {
    const { title, type, description, date, location, status } = req.body;
    const activity = await Activity.create({
      title,
      type,
      description,
      date,
      location,
      status: status || 'pending'
    });
    res.status(201).json(activity);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivities = async (req: Request, res: Response) => {
  try {
    const activities = await Activity.find().sort({ date: 1 });
    res.json(activities);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateActivity = async (req: Request, res: Response) => {
  try {
    const updated = await Activity.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: 'Activity deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
