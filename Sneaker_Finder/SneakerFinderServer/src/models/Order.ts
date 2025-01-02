import mongoose, { Document, Schema } from 'mongoose';

interface IProduct {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  date: Date;
  status: string;
  products: IProduct[];
  totalAmount: number;
  paymentId: string;
}

const orderSchema = new Schema({
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
    default: 'completed'
  },
  products: [{
    name: String,
    size: String,
    price: Number,
    quantity: Number
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
