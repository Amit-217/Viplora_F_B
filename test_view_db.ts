import mongoose from 'mongoose';
import VolunteerApplication from './src/modules/volunteer/volunteer.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI || '');
  const latest = await VolunteerApplication.findOne().sort({ createdAt: -1 });
  console.log('--- LATEST APPLICATION ---');
  console.log(latest);
  await mongoose.disconnect();
}

check();
