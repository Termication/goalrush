import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Author from '@/models/Author';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// GET: Fetch all staff members
export async function GET() {
  try {
    await dbConnect();

    // Ensure Author schema is registered before populate
    const _ensureAuthor = Author;

    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const users = await User.find({})
      .populate('author')
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Create new staff & author
export async function POST(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, slug, email, password, role, bio, titleRole, avatarUrl } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanSlug = slug?.trim();

    // 1. Check for duplicate email across Users and Authors
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'A user account with this email already exists.' },
        { status: 400 }
      );
    }

    // 2. Check for duplicate slug if provided
    if (cleanSlug) {
      const existingSlug = await Author.findOne({ slug: cleanSlug });
      if (existingSlug) {
        return NextResponse.json(
          { success: false, error: 'This author slug is already taken. Please choose another.' },
          { status: 400 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password.trim(), 12);

    // 3. Create Author Profile
    let author;
    try {
      author = await Author.create({
        name: name.trim(),
        ...(cleanSlug ? { slug: cleanSlug } : {}),
        email: cleanEmail,
        role: titleRole?.trim() || 'Staff Writer',
        avatarUrl: avatarUrl?.trim() || '',
        bio: bio?.trim() || '',
      });
    } catch (err: any) {
      if (err.code === 11000) {
        return NextResponse.json(
          { success: false, error: 'An author with this name or slug already exists.' },
          { status: 400 }
        );
      }
      throw err;
    }

    // 4. Create User Account with rollback on failure
    let user;
    try {
      user = await User.create({
        email: cleanEmail,
        passwordHash,
        author: author._id,
        role: role || 'author',
      });
    } catch (err: any) {
      // Cleanup orphaned author if user creation fails
      await Author.findByIdAndDelete(author._id);
      throw err;
    }

    // 5. Link User to Author
    author.user = user._id;
    await author.save();

    // 6. Safe User Object for Response (strip passwordHash)
    const safeUser = {
      _id: user._id,
      email: user.email,
      role: user.role,
      author: author,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ success: true, user: safeUser }, { status: 201 });
  } catch (err: any) {
    console.error('❌ Error creating staff member:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'An unexpected server error occurred.' },
      { status: 500 }
    );
  }
}