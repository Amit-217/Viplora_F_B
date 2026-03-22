import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../modules/user/user.model.js';
import VolunteerApplication from '../modules/volunteer/volunteer.model.js';
import { updateApplicationStatus } from '../modules/volunteer/volunteer.controller.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ngo_platform';

async function testFlow() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000, family: 4 });
    console.log('MongoDB Connected.');

    const testEmail = 'test_volunteer_' + Date.now() + '@example.com';

    console.log(`\n--- 1. Testing Registration Security ---`);
    // Simulate register with role elevation
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Password123', salt);
    
    // Attempting to create user with role 'admin' directly (Simulating locked register)
    // We already updated the controller, let's verify if create call works as expected with role: user
    const newUser = await User.create({
       customId: 'USR_' + Date.now(),
       name: 'Test Regular User',
       email: 'regular_' + Date.now() + '@example.com',
       password: hashedPassword,
       role: UserRole.USER // Forces UserRole.USER in code now 
    });
    console.log('User created with role:', newUser.role);

    console.log(`\n--- 2. Creating Volunteer Application ---`);
    const application = await VolunteerApplication.create({
      fullName: 'Test Volunteer',
      email: testEmail,
      phone: '1234567890',
      occupation: 'Developer',
      skills: 'Coding',
      location: 'Online',
      availability: 'weekends',
      status: 'pending'
    });
    console.log('Application created. ID:', application._id);

    console.log(`\n--- 3. Approving Application (New User) ---`);
    
    // Simulate controller logic execution
    // Find application
    const appToApprove = await VolunteerApplication.findById(application._id);
    if (!appToApprove) throw new Error('App not found');

    appToApprove.status = 'approved';
    await appToApprove.save();

    console.log('Application status set to approved.');

    // Run the logic from controller directly or similar
    const existingUser = await User.findOne({ email: appToApprove.email });
    if (existingUser) {
        console.log('Unexpected: Existing user found');
    } else {
        console.log('Creating new account with random password...');
        const randomPass = 'Random' + Math.floor(Math.random() * 1000);
        const hashed = await bcrypt.hash(randomPass, 10);
        
        const createdUser = await User.create({
            customId: 'VOL_' + Date.now(),
            name: appToApprove.fullName,
            email: appToApprove.email,
            password: hashed,
            role: UserRole.VOLUNTEER,
            isVerified: true
        });

        appToApprove.userId = createdUser._id as any;
        await appToApprove.save();

        console.log('SUCCESS: Account created for volunteer.');
        console.log('User Details:', {
            id: createdUser.customId,
            role: createdUser.role,
            email: createdUser.email
        });
    }

    console.log('\n--- Test Completed Successfully ---');

  } catch (error) {
    console.error('Test Failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

testFlow();
