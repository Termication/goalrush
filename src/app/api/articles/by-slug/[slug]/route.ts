import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Article from '@/models/Article'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await dbConnect()

    const article = await Article.findOne({ slug: params.slug })
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: article })
  } catch (err) {
    console.error('Error fetching article by slug:', err)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}
