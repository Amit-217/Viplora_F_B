import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../modules/user/user.model.js';
import VolunteerApplication from '../modules/volunteer/volunteer.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_platform';

async function verify() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 });
    console.log('MongoDB Connected.');

    const initialPending = await VolunteerApplication.countDocuments({ status: 'pending' });
    const initialTotal = await VolunteerApplication.countDocuments();

    console.log(`\n--- 1. Testing Application Submission Stats ---`);
    console.log(`Initial Pending: ${initialPending}`);
    console.log(`Initial Total: ${initialTotal}`);

    const testEmail = 'stats_test_' + Date.now() + '@example.com';
    const app = await VolunteerApplication.create({
        fullName: 'Stats Test Volunteer',
        email: testEmail,
        phone: '0000000000',
        occupation: 'Tester',
        skills: 'Testing',
        location: 'Local',
        availability: 'weekdays',
        status: 'pending'
    });
    console.log('Application created. ID:', app._id);

    const afterPending = await VolunteerApplication.countDocuments({ status: 'pending' });
    const afterTotal = await VolunteerApplication.countDocuments();

    console.log(`After Pending: ${afterPending}`);
    console.log(`After Total: ${afterTotal}`);

    if (afterPending === initialPending + 1 && afterTotal === initialTotal + 1) {
        console.log('SUCCESS: Stats count correctly incremented.');
    } else {
        console.error('FAIL: Stats count mismatch!');
    }

    console.log(`\n--- 2. Testing Application CRUD ---`);
    // Edit details
    app.skills = 'Advanced Testing';
    await app.save();
    console.log('Skills updated.');

    const updatedApp = await VolunteerApplication.findById(app._id);
    if (updatedApp && updatedApp.skills === 'Advanced Testing') {
        console.log('SUCCESS: Application Update verified.');
    } else {
        console.error('FAIL: Application Update verification failed.');
    }

    // Delete
    await VolunteerApplication.findByIdAndDelete(app._id);
    console.log('Application deleted.');

    const finalPending = await VolunteerApplication.countDocuments({ status: 'pending' });
    if (finalPending === initialPending) {
        console.log('SUCCESS: Application Deletion verified.');
    } else {
        console.error('FAIL: Deletion verification failed.');
    }

    console.log('\n--- Verification Completed Successfully ---');

  } catch (error) {
    console.error('Verification Failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

verify();
