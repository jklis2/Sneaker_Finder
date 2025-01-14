import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

interface IShippingAddress {
  street: string;
  number: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  province: string;
  phoneNumber: string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  gender: "Male" | "Female";
  birthDate: Date;
  password: string;
  profilePicture?: string;
  shippingAddresses?: IShippingAddress[];
  role: "admin" | "user";
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const ShippingAddressSchema: Schema = new Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  apartmentNumber: { type: String, required: false },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  province: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    birthDate: { type: Date, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String, required: false },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    shippingAddresses: { type: [ShippingAddressSchema], required: false, default: [] },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
