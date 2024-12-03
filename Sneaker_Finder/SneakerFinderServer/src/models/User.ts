import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  gender: "Male" | "Female";
  birthDate: Date;
  password: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    birthDate: { type: Date, required: true },
    password: { type: String, required: true },
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
