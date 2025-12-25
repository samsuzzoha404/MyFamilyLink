import mongoose from 'mongoose';
import Citizen from '../models/Citizen';
import Application from '../models/Application';
import connectDB from '../config/db';

/**
 * Seed script to populate the database with demo personas
 * Run with: npx tsx src/seed/seed.ts
 */

const seedData = [
  {
    mykadNumber: '900101145000',
    fullName: 'Ali bin Abdullah',
    householdIncome: 1500,
    category: 'B40' as const,
    linkedAccount: {
      hasAccount: true,
      bankName: 'Maybank',
      accountNumber: '1234567890',
    },
  },
  {
    mykadNumber: '950505106000',
    fullName: 'Chong Wei Ming',
    householdIncome: 4500,
    category: 'M40' as const,
    linkedAccount: {
      hasAccount: false,
      bankName: '',
      accountNumber: '',
    },
  },
  {
    mykadNumber: '881212147000',
    fullName: 'Subramanian Ramasamy',
    householdIncome: 15000,
    category: 'T20' as const,
    linkedAccount: {
      hasAccount: true,
      bankName: 'CIMB Bank',
      accountNumber: '9876543210',
    },
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Connect to MongoDB
    await connectDB();

    // Clear existing citizens and applications
    const deleteCitizensResult = await Citizen.deleteMany({});
    const deleteAppsResult = await Application.deleteMany({});
    console.log(`🗑️  Cleared ${deleteCitizensResult.deletedCount} existing citizens`);
    console.log(`🗑️  Cleared ${deleteAppsResult.deletedCount} existing applications\n`);

    // Insert seed data
    const citizens = await Citizen.insertMany(seedData);

    console.log('✅ Successfully seeded the database with demo personas:\n');
    citizens.forEach((citizen, index) => {
      console.log(`${index + 1}. ${citizen.fullName}`);
      console.log(`   MyKad: ${citizen.mykadNumber}`);
      console.log(`   Income: RM ${citizen.householdIncome}`);
      console.log(`   Category: ${citizen.category}`);
      console.log(`   Linked Account: ${citizen.linkedAccount.hasAccount ? 'Yes' : 'No'}`);
      console.log('');
    });

    console.log('🎉 Seed completed successfully!\n');
    console.log('📋 You can now use these MyKad numbers for testing:');
    console.log('   • Ali (B40, Auto-Approve): 900101145000');
    console.log('   • Chong (M40, Borderline): 950505106000');
    console.log('   • Subra (T20, Manual Review): 881212147000');
    console.log('');

    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from database');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed
seedDatabase();
