import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';
import { Project } from './models/Project.js';
import { ProjectRisk } from './models/ProjectRisk.js';
import { Alert } from './models/Alert.js';
import { ProjectPhoto } from './models/ProjectPhoto.js';
import { initialProjects, initialRisks, initialAlerts } from './data/seedData.js';

dotenv.config();

const seedDatabase = async () => {
  await connectDB();

  if (mongoose.connection.readyState !== 1) {
    console.log('[Seed] Notice: External MongoDB not connected; memory fallback state initialized.');
    process.exit(0);
  }

  try {
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      ProjectRisk.deleteMany({}),
      Alert.deleteMany({}),
      ProjectPhoto.deleteMany({}),
    ]);

    console.log('[Seed] Seeding administrative users...');
    await User.create([
      {
        name: 'Dr. Arvind Subramanian',
        email: 'admin@example.com',
        password: 'password123',
        role: 'MINISTRY_ADMIN',
        department: 'MoSPI National Infrastructure Division',
        state: 'National',
        district: 'All Districts',
      },
      {
        name: 'Priya Sundaram',
        email: 'analyst@example.com',
        password: 'password123',
        role: 'ANALYST',
        department: 'National Risk Intelligence & Audit Unit',
        state: 'National',
        district: 'All Districts',
      },
      {
        name: 'Shri Rajeshwar Rao, IAS',
        email: 'dc.pune@example.com',
        password: 'password123',
        role: 'DISTRICT_AUTHORITY',
        department: 'District Collectorate & Planning Cell',
        state: 'Maharashtra',
        district: 'Pune',
      }
    ]);

    console.log('[Seed] Seeding projects...');
    await Project.create(initialProjects);

    console.log('[Seed] Seeding risk assessments...');
    await ProjectRisk.create(initialRisks);

    console.log('[Seed] Seeding supervisory alerts...');
    await Alert.create(initialAlerts);

    console.log('[Seed] Successfully seeded Nirikshan-AI database!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error during seeding:', error);
    process.exit(1);
  }
};

seedDatabase();
