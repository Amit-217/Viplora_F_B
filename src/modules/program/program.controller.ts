import { Request, Response } from 'express';
import Program from './program.model.js';

export const getAllPrograms = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, isActive: true } : { isActive: true };
    const programs = await Program.find(filter).sort({ createdAt: -1 });
    res.json(programs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgramBySlug = async (req: Request, res: Response) => {
  try {
    const program = await Program.findOne({ slug: req.params.slug, isActive: true });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(program);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const program = await Program.create({ ...req.body, slug });
    res.status(201).json(program);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(program);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
