import mongoose, { Schema, Document } from "mongoose";

export interface IStockx extends Document {
  name: string;
  price: number;
}

const stocksSchema: Schema<IStockx> = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const Stockx = mongoose.model<IStockx>("Stockx", stocksSchema);

export default Stockx;
