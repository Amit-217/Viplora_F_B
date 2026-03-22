import { Request, Response } from 'express';
import Gallery from './gallery.model.js';

export const getAllGallery = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const galleryItems = await Gallery.find(filter).sort({ createdAt: -1 });
    res.json(galleryItems);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  try {
    const { title, category } = req.body;
    const images = req.files ? (req.files as Express.Multer.File[]).map(f => f.path) : [];
    const mainImage = images[0] || req.body.image;

    if (!mainImage) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    const item = await Gallery.create({ 
      title, 
      category, 
      image: mainImage,
      images 
    });
    res.status(201).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gallery item deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
