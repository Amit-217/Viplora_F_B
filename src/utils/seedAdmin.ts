import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../modules/user/user.model.js';
import { generateCustomId } from './idGenerator.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI as string, { serverSelectionTimeoutMS: 5000, family: 4 });
    console.log('MongoDB Connected successfully.');

    const adminEmail = process.env.SUPER_ADMIN_EMAIL;
    const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Error: SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is not set in .env');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log(`Admin with email ${adminEmail} already exists.`);
      console.log('Details:', {
        id: existingAdmin.customId,
        name: existingAdmin.name,
        role: existingAdmin.role,
        isVerified: existingAdmin.isVerified
      });
      process.exit(0);
    }

    console.log(`Creating admin user: ${adminEmail}`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    const customId = await generateCustomId(UserRole.ADMIN);

    const newAdmin = await User.create({
      customId,
      name: 'Amit Chandure',
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true
    });

    console.log('Admin user created successfully!');
    console.log('Details:', {
      id: newAdmin.customId,
      name: newAdmin.name,
      role: newAdmin.role,
      isVerified: newAdmin.isVerified
    });
    console.log(`IMPORTANT: Password is set to "${adminPassword}".`);

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

seedAdmin();
