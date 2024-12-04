import mongoose, { Document, Schema } from "mongoose";

interface IStockx extends Document {
  name: string;
  price: number;
}

const stocksSchema = new Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const Stockx = mongoose.model<IStockx>("Stockx", stocksSchema);

export default Stockx;
