import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  author?: Schema.Types.ObjectId;
  role: 'admin' | 'editor' | 'author';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email.'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Please provide a password hash.'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      default: null,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'author'],
      default: 'author',
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;