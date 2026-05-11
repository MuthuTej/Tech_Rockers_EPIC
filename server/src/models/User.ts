import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string; // E.g., E001, M001
  name: string;
  initials: string;
  role: string;
  email: string;
  maxHours: number;
}

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  initials: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  maxHours: { type: Number, required: true, default: 0 },
});

export const User = mongoose.model<IUser>('User', UserSchema);
