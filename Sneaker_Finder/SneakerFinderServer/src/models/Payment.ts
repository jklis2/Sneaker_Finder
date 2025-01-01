import mongoose, { Schema, Document } from 'mongoose';

interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  status: string;
  orderId: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, required: true },
  orderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
