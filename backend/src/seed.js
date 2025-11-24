import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Domain, User, Folder } from '@mailo/shared';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mailo');
    console.log('Connected to MongoDB');

    // Check if domain exists
    let domain = await Domain.findOne({ name: 'example.com' });
    if (!domain) {
      domain = await Domain.create({
        name: 'example.com',
        settings: { maxUsers: 100 }
      });
      console.log('Created domain: example.com');
    } else {
      console.log('Domain example.com already exists');
    }

    // Check if admin user exists
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);

      user = await User.create({
        email: 'admin@example.com',
        passwordHash,
        domain: domain._id,
        role: 'super_admin'
      });
      console.log('Created user: admin@example.com');

      // Create default folders
      const folders = ['inbox', 'sent', 'drafts', 'trash', 'junk'];
      for (const type of folders) {
        await Folder.create({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          type,
          user: user._id
        });
      }
      console.log('Created default folders for admin');
    } else {
      console.log('User admin@example.com already exists');
    }

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
