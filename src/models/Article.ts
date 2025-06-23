import mongoose, { Schema, Document, models } from 'mongoose';

// 1. DEFINE THE INTERFACE FOR THE DOCUMENT (TYPE-CHECKING)
export interface IArticle extends Document {
  title: string;
  summary: string;
  body: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. DEFINE THE MONGOOSE SCHEMA
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
}, {
  // Add timestamps to automatically create `createdAt` and `updatedAt` fields
  timestamps: true,
});

// 3. CREATE AND EXPORT THE MODEL
const Article = models.Article || mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
