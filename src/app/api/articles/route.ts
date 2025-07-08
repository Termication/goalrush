import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import slugify from 'slugify';

// Handle GET requests — fetch all articles
export async function GET() {
  try {
    await dbConnect();

    const articles = await Article.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// Handle POST requests — create a new article
export async function POST(request: Request) {
  try {
    await dbConnect();
    console.log("✅ Connected to MongoDB");

    const body = await request.json();
    const { title, summary, body: articleBody, imageUrl, category, isFeatured } = body;

    if (!title || !summary || !articleBody || !imageUrl || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Generate a slug manually
  let slug = slugify(title, { lower: true, strict: true });
  let count = 1;
  const ArticleModel = (Article as any).default || Article;

  while (await ArticleModel.findOne({ slug })) {
    slug = `${slug}-${count++}`;
  }


    const newArticle = await new ArticleModel({
      title,
      summary,
      body: articleBody,
      imageUrl,
      category,
      isFeatured,
      slug,
    }).save();

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating article:", error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}