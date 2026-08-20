import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Article from '@/models/Article';
import Author from '@/models/Author';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const _ensureAuthor = Author;

    const article = await Article.findById(id).populate('author');
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const _ensureAuthor = Author;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const reqBody = await request.json();

    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // 1. EDIT EXISTING THREAD UPDATE
    if ('editThreadUpdate' in reqBody && reqBody.editThreadUpdate?.id) {
      const threadToEdit = article.updates.id(reqBody.editThreadUpdate.id);

      if (!threadToEdit) {
        return NextResponse.json({ success: false, error: 'Thread update not found in database' }, { status: 404 });
      }

      threadToEdit.body = reqBody.editThreadUpdate.body;
      await article.save();
      await article.populate('author');
      return NextResponse.json({ success: true, article });
    }

    // 2. ADD NEW THREAD UPDATE
    if ('newThreadReply' in reqBody && reqBody.newThreadReply) {
      if (!article.updates) article.updates = [];

      const ReplyData = reqBody.newThreadReply;
      article.updates.push({
        title: ReplyData.title || '',
        summary: ReplyData.summary || '',
        body: ReplyData.body,
        createdAt: new Date(),
      });

      await article.save();
      await article.populate('author');
      return NextResponse.json({ success: true, article });
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

    // Preserve/Assign Author fallback to satisfy Mongoose validation
    if (reqBody.author) {
          article.author = reqBody.author;
        } else if (!article.author) {
          const sessionAuthorId = (session.user as any)?.authorId;
          if (sessionAuthorId) {
            article.author = sessionAuthorId;
          }
        }

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
    await article.populate('author');
    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    console.error('❌ Article update error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const updateId = searchParams.get('updateId');

    // 1. DELETE SPECIFIC THREAD UPDATE
    if (updateId) {
      const article = await Article.findById(id);
      if (!article) return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });

      article.updates.pull(updateId);
      await article.save();
      await article.populate('author');

      return NextResponse.json({ success: true, article });
    }

    // 2. DELETE ENTIRE ARTICLE
    const deleted = await Article.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}