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
  
  // Fetch the article into memory first so Mongoose can work its magic
  const article = await Article.findById(id);
  if (!article) {
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  }

  // 1. EDIT EXISTING THREAD UPDATE
  if ('editThreadUpdate' in reqBody && reqBody.editThreadUpdate?.id) {
    try {
      // .id() is a special Mongoose method that automatically handles String -> ObjectId casting
      const threadToEdit = article.updates.id(reqBody.editThreadUpdate.id);
      
      if (threadToEdit) {
        threadToEdit.body = reqBody.editThreadUpdate.body;
        await article.save();
        return NextResponse.json({ success: true, article });
      } else {
        return NextResponse.json({ success: false, error: 'Thread update not found in database' }, { status: 404 });
      }
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to edit thread update' }, { status: 500 });
    }
  }

  // 2. ADD NEW THREAD UPDATE
  if ('newThreadReply' in reqBody && reqBody.newThreadReply) {
    try {
      if (!article.updates) article.updates = [];
      
      const ReplyData = reqBody.newThreadReply;

      article.updates.push({
        title: ReplyData.title || '',
        summary: ReplyData.summary || '',
        body: ReplyData.body,
        createdAt: new Date(),
      });
      
      await article.save();
      return NextResponse.json({ success: true, article });
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to push thread update' }, { status: 500 });
    }
  }

  // 3. STANDARD ARTICLE UPDATE (Main form save)
  if ('title' in reqBody) article.title = reqBody.title;
  if ('summary' in reqBody) article.summary = reqBody.summary;
  if ('body' in reqBody) article.body = reqBody.body;
  if ('imageUrl' in reqBody) article.imageUrl = reqBody.imageUrl;
  if ('category' in reqBody) article.category = reqBody.category;
  if ('isFeatured' in reqBody) article.isFeatured = reqBody.isFeatured;
  if ('isTrending' in reqBody) article.isTrending = reqBody.isTrending;
  if ('imageAlt' in reqBody) article.imageAlt = reqBody.imageAlt;
  if ('email' in reqBody) article.email = reqBody.email;
  
  if ('updates' in reqBody && Array.isArray(reqBody.updates)) {
    article.updates = reqBody.updates.map((update: any) => ({
      _id: update._id, 
      title: update.title,
      summary: update.summary,
      body: update.body,
      createdAt: new Date(update.createdAt),
    }));
  }

  if ('seoTags' in reqBody && Array.isArray(reqBody.seoTags)) {
    const tagsString = reqBody.seoTags.join(', ');
    if (tagsString.length > 300) {
      return NextResponse.json({ success: false, error: 'SEO tags exceed 300 characters' }, { status: 400 });
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

  const { searchParams } = new URL(request.url);
  const updateId = searchParams.get('updateId');

  // 1. DELETE SPECIFIC THREAD UPDATE
  if (updateId) {
    try {
      const article = await Article.findById(id);
      if (!article) return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });

      // .pull() automatically finds the matching ObjectId and removes it from the array
      article.updates.pull(updateId);
      await article.save();
      
      return NextResponse.json({ success: true, article });
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Failed to delete thread update' }, { status: 500 });
    }
  }

  // 2. DELETE ENTIRE ARTICLE
  const deleted = await Article.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}