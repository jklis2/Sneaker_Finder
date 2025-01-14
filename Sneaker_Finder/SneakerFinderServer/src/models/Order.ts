import mongoose, { Document, Schema, Types } from 'mongoose';

interface IProduct {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderNumber: string;
  date: Date;
  status: string;
  products: IProduct[];
  totalAmount: number;
  paymentId: string;
}

const orderSchema = new Schema<IOrder>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    default: 'pending'
  },
  products: [{
    name: { type: String, required: true },
    size: { type: String, required: true, default: 'N/A' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentId: {
    type: String,
    required: true
  }
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
