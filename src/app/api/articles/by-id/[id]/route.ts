import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

// === GET Article by ID ===
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await dbConnect();

    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// === PUT: Update Article ===
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await dbConnect();
    const reqBody = await req.json();
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // Update editable fields
    if ('title' in reqBody) article.title = reqBody.title;
    if ('summary' in reqBody) article.summary = reqBody.summary;
    if ('body' in reqBody) article.body = reqBody.body;
    if ('imageUrl' in reqBody) article.imageUrl = reqBody.imageUrl;
    if ('category' in reqBody) article.category = reqBody.category;
    if ('isFeatured' in reqBody) article.isFeatured = reqBody.isFeatured;

    // Handle SEO tags safely
    if ('seoTags' in reqBody && Array.isArray(reqBody.seoTags)) {
      const tagsString = reqBody.seoTags.join(', ');
      if (tagsString.length > 300) {
        return NextResponse.json(
          { success: false, error: 'SEO tags exceed 300 characters' },
          { status: 400 }
        );
      }
      article.seoTags = reqBody.seoTags;
    }

    await article.save();

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}

// === DELETE: Remove Article ===
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    await dbConnect();

    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting article:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete article' }, { status: 500 });
  }
}
