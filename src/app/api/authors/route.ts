import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Author from '@/models/Author';

// GET all authors
export async function GET() {
  await dbConnect();
  try {
    const authors = await Author.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, authors });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch authors' }, { status: 500 });
  }
}

// POST create a new author
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const author = await Author.create(body);
    return NextResponse.json({ success: true, author }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}