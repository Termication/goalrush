import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect();

    const ArticleModel = (Article as any).default || Article;
    const article = await ArticleModel.findOne({ slug: params.slug });

    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
