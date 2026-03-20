import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './modules/auth/auth.routes.js';
import programRoutes from './modules/program/program.routes.js';
import donationRoutes from './modules/donation/donation.routes.js';
import volunteerRoutes from './modules/volunteer/volunteer.routes.js';
import blogRoutes from './modules/blog/blog.routes.js';
import galleryRoutes from './modules/gallery/gallery.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
// Health Check
app.get('/', (req: Request, res: Response) => {
    res.send('VIPLORA NGO API is running (ES6 + TypeScript + Contact Support)...');
});

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_platform';

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 })
    .then(() => {
        console.log('MongoDB Connected successfully to:', MONGO_URI);
    })
    .catch(err => {
        console.log('DB Connection Error (Please whitelist your IP in MongoDB Atlas):', err.message);
    });

// Always start the port listener so frontend doesn't get 'Connection Refused'
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
