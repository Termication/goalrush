import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';

// This function will handle POST requests to /api/articles
export async function POST(request: Request) {
  try {
    // 1. Connect to the database
    await dbConnect();
    console.log("Database connected successfully for POST request.");

    // 2. Parse the incoming request body
    const body = await request.json();
    console.log("Request body:", body);

    // Basic validation
    const { title, summary, body: articleBody, imageUrl, category } = body;
    if (!title || !summary || !articleBody || !imageUrl || !category) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 3. Create a new article using the Article model
    const ArticleModel = (Article as any).default || Article;
    const articleInstance = new ArticleModel(body);
    const newArticle = await articleInstance.save();
    
    console.log("New article created:", newArticle);

    // 4. Return a success response with the created article data
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });

  } catch (error: any) {
    // 5. Handle any errors that occur
    console.error("Error creating article:", error);
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}