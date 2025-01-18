import mongoose, { Document, Schema } from "mongoose";

interface IStockx extends Document {
  name: string;
  price: number;
  brand: string;
  color: string;
  imageUrl: string;
  availableSizes: string[];
  availability: string;
}

const stocksSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    default: "Unknown",
  },
  color: {
    type: String,
    default: "Unknown",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  availableSizes: {
    type: [String],
    default: [],
  },
  availability: {
    type: String,
    enum: ['available', 'out_of_stock'],
    default: 'available',
  },
});

const Stockx = mongoose.model<IStockx>("Stockx", stocksSchema);

export default Stockx;
