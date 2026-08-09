import mongoose, { Schema, Document, models } from 'mongoose';
import slugify from 'slugify';

export interface IAuthor extends Document {
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
  role?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an author name.'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    bio: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'Staff Writer',
    },
    email: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

AuthorSchema.pre<IAuthor>('validate', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Author = models.Author || mongoose.model<IAuthor>('Author', AuthorSchema);
export default Author;