import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Author from '@/models/Author';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await dbConnect();

  try {
    const author = await Author.findOne({ slug });
    if (!author) {
      return NextResponse.json({ success: false, error: 'Author not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, author });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch author' }, { status: 500 });
  }
}