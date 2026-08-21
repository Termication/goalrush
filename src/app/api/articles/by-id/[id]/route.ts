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

    // 1. Fetch document WITHOUT population to ensure fields remain raw ObjectIds
    const article = await Article.findById(id);
    if (!article) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    // 2. Handle Live Thread Update Edit
    if ('editThreadUpdate' in reqBody && reqBody.editThreadUpdate?.id) {
      const threadToEdit = article.updates?.id(reqBody.editThreadUpdate.id);

      if (!threadToEdit) {
        return NextResponse.json({ success: false, error: 'Thread update not found in database' }, { status: 404 });
      }

      threadToEdit.body = reqBody.editThreadUpdate.body;
      await article.save();
      return NextResponse.json({ success: true, article });
    }

    // 3. Handle Live Thread Reply / New Update
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
      return NextResponse.json({ success: true, article });
    }

    // 4. Resolve Author ID cleanly (handles string, populated object, or fallback)
    let authorIdToAssign: any = null;

    if (reqBody.author) {
      if (typeof reqBody.author === 'string' && reqBody.author.trim() !== '') {
        authorIdToAssign = reqBody.author.trim();
      } else if (typeof reqBody.author === 'object' && reqBody.author._id) {
        authorIdToAssign = reqBody.author._id;
      }
    }

    if (!authorIdToAssign && article.author) {
      authorIdToAssign = typeof article.author === 'object' && (article.author as any)._id
        ? (article.author as any)._id
        : article.author;
    }

    if (!authorIdToAssign) {
      const sessionAuthorId = (session.user as any)?.authorId;
      if (sessionAuthorId) {
        authorIdToAssign = sessionAuthorId;
      } else {
        const dbUser = await User.findOne({ email: session.user?.email });
        if (dbUser?.author) {
          authorIdToAssign = dbUser.author;
        }
      }
    }

    // 5. Update direct fields
    if ('title' in reqBody) article.title = reqBody.title;
    if ('summary' in reqBody) article.summary = reqBody.summary;
    if ('body' in reqBody) article.body = reqBody.body;
    if ('imageUrl' in reqBody) article.imageUrl = reqBody.imageUrl;
    if ('category' in reqBody) article.category = reqBody.category;
    if ('isFeatured' in reqBody) article.isFeatured = Boolean(reqBody.isFeatured);
    if ('isTrending' in reqBody) article.isTrending = Boolean(reqBody.isTrending);
    if ('imageAlt' in reqBody) article.imageAlt = reqBody.imageAlt;
    if ('email' in reqBody) article.email = reqBody.email;

    if (authorIdToAssign) {
      article.author = authorIdToAssign;
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