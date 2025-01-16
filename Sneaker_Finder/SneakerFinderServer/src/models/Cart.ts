import mongoose, { Document, Schema } from "mongoose";

interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

interface IShippingAddress {
  street: string;
  number: string;
  apartmentNumber?: string;
  city: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
}

interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  total: number;
  shippingAddress?: IShippingAddress;
}

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  size: { type: String }
});

const ShippingAddressSchema = new Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  apartmentNumber: { type: String },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
    total: { type: Number, required: true, default: 0 },
    shippingAddress: { type: ShippingAddressSchema, required: false }
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
