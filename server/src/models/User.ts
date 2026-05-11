import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: string;       // stores email — used as the universal identity key
  name: string;
  initials: string;
  role: string;     // 'manager' | 'engineer'
  email: string;
  picture: string;
  maxHours: number;
}

const UserSchema = new Schema<IUser>({
  id:       { type: String, required: true, unique: true }, // = email
  name:     { type: String, required: true },
  initials: { type: String, required: true },
  role:     { type: String, required: true, enum: ['manager', 'engineer'] },
  email:    { type: String, required: true, unique: true },
  picture:  { type: String, default: '' },
  maxHours: { type: Number, required: true, default: 120 },
});

export const User = mongoose.model<IUser>('User', UserSchema);
