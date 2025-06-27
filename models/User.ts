import mongoose, { Schema, Model } from 'mongoose';
import { User } from '@/types/User';

// Create a Schema corresponding to the User interface
const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    division: { type: String, required: true },
    plant: { type: String, required: true },
    supervisor: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create User model or get the existing model
// This approach prevents model overwrite errors during hot reloading
const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', userSchema);

export default UserModel;