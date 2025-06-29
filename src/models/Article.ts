import mongoose, { Schema, Document, models } from 'mongoose';
import slugify from 'slugify';

// 1. INTERFACE
export interface IArticle extends Document {
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. SCHEMA
const ArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the article.'],
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'Please provide a summary for the article.'],
    trim: true,
  },
  body: {
    type: String,
    required: [true, 'Please provide a body for the article.'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL for the article.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for the article.'],
    trim: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// 3. PRE-SAVE HOOK TO GENERATE SLUG
ArticleSchema.pre<IArticle>('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});


// 4. MODEL
const Article = models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
export default Article;
