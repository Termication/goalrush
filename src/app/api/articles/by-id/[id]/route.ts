import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await dbConnect();
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, article });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  const reqBody = await request.json();
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  }

  if ('title' in reqBody) article.title = reqBody.title;
  if ('summary' in reqBody) article.summary = reqBody.summary;
  if ('body' in reqBody) article.body = reqBody.body;
  if ('imageUrl' in reqBody) article.imageUrl = reqBody.imageUrl;
  if ('category' in reqBody) article.category = reqBody.category;
  if ('isFeatured' in reqBody) article.isFeatured = reqBody.isFeatured;

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
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();

  const deleted = await Article.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
