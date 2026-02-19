import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/user.js'; // Your User model
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');

    const email = 'superadmin@unisphere.com';
    const password = 'admin123'; // Change in production!

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log('Super Admin already exists');
      process.exit(0);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: email.toLowerCase(),
      phoneNo: '0000000000',
      password: hashPassword,
      role: 'superAdmin',
    });

    await superAdmin.save();
    console.log('Super Admin created successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });