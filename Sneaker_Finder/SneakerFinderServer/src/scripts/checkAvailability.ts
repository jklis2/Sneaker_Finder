import mongoose from 'mongoose';
import Stockx from '../models/StockX';
import dotenv from 'dotenv';

dotenv.config();

const checkAvailability = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL || '');
    console.log('Connected to MongoDB\n');

    const totalProducts = await Stockx.countDocuments();
    const availableProducts = await Stockx.countDocuments({ availability: 'available' });
    const outOfStockProducts = await Stockx.countDocuments({ availability: 'out_of_stock' });
    const noAvailabilityField = await Stockx.countDocuments({ availability: { $exists: false } });

    console.log('Product Availability Statistics:');
    console.log('--------------------------------');
    console.log(`Total products: ${totalProducts}`);
    console.log(`Available products: ${availableProducts}`);
    console.log(`Out of stock products: ${outOfStockProducts}`);
    console.log(`Products with no availability field: ${noAvailabilityField}\n`);

    console.log('Example Products:');
    console.log('----------------');
    const products = await Stockx.find().limit(5);
    products.forEach(product => {
      console.log(`Name: ${product.name}`);
      console.log(`Availability: ${product.availability}`);
      console.log('---');
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAvailability();
