import { Request, Response } from 'express';
import Contact from './contact.model.js';

export const submitMessage = async (req: Request, res: Response) => {
  try {
    const message = await Contact.create(req.body);
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMessageStatus = async (req: Request, res: Response) => {
  try {
    const message = await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
