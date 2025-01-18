import mongoose from 'mongoose';
import Stockx from '../models/StockX';
import dotenv from 'dotenv';

dotenv.config();

const updateAvailability = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL || '');
    console.log('Connected to MongoDB');

    // Update all products to be available
    const result = await Stockx.updateMany(
      { availability: { $exists: false } }, // Find documents where availability is not set
      { $set: { availability: 'available' } } // Set availability to 'available'
    );

    console.log(`Updated ${result.modifiedCount} products`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the migration
updateAvailability();
