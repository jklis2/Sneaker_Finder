import mongoose, { Document, Schema } from "mongoose";

interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  total: number;
}

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String }
});

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    total: { type: Number, required: true, default: 0 }
  },
  {
    timestamps: true,
  }
);

// Update total when items change
CartSchema.pre("save", function(next) {
  this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  next();
});

const Cart = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
