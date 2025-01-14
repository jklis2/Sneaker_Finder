import mongoose, { Document, Schema, Types } from 'mongoose';

interface IProduct {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface IShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  orderNumber: string;
  date: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  products: IProduct[];
  totalAmount: number;
  paymentId: string;
  shippingAddress: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
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
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
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
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  }
}, {
  timestamps: true
});

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
