import { Request, Response } from 'express';
import Program from './program.model.js';
import cloudinary from '../../config/cloudinary.js';

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
    
    if (req.body.impactStats) {
      try {
        req.body.impactStats = JSON.parse(req.body.impactStats);
      } catch (e) {}
    }

    // Extract files
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files && files['image'] ? files['image'][0].path : undefined;
    const gallery = files && files['gallery'] ? files['gallery'].map(file => file.path) : [];

    const program = await Program.create({ 
      ...req.body, 
      slug,
      image,
      gallery
    });
    
    res.status(201).json(program);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const updateData = { ...req.body };

    if (updateData.impactStats) {
      try {
        updateData.impactStats = JSON.parse(updateData.impactStats);
      } catch (e) {}
    }

    // Parse existing gallery if sent as JSON string
    let existingGallery: string[] = [];
    if (req.body.existingGallery) {
      try {
        existingGallery = JSON.parse(req.body.existingGallery);
      } catch (e) {
        existingGallery = Array.isArray(req.body.existingGallery) ? req.body.existingGallery : [req.body.existingGallery];
      }
    }

    if (files && files['image']) {
      updateData.image = files['image'][0].path;
    } else if (req.body.removeCoverImage === 'true') {
      updateData.image = '';
    }
    
    let finalGallery: string[] = existingGallery;
    if (files && files['gallery'] && files['gallery'].length > 0) {
      finalGallery = [...existingGallery, ...files['gallery'].map(file => file.path)];
    }
    
    if (req.body.existingGallery) {
      updateData.gallery = finalGallery;
    }

    const program = await Program.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(program);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const deleteFromCloudinary = async (url: string) => {
      try {
        if (url && url.includes('cloudinary.com')) {
          const publicId = url.split('/').slice(-2).join('/').split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.error("Cloudinary Delete Failed", err);
      }
    };

    if (program.image) await deleteFromCloudinary(program.image);
    if (program.gallery && program.gallery.length > 0) {
      for (const imgUrl of program.gallery) {
        await deleteFromCloudinary(imgUrl);
      }
    }

    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: 'Program and associated images deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
