import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Author from '@/models/Author';

export async function GET() {
  await dbConnect();


  // Check if an admin user already exists
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_EMAIL or ADMIN_PASSWORD missing in environment variables' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.passwordHash = passwordHash;
      await user.save();
      return NextResponse.json({
        success: true,
        message: 'Admin password successfully updated in database.',
      });
    }

    // If no admin user exists, create a new one along with an associated author profile
    const author = await Author.create({
      name: 'GoalRush Admin',
      email: adminEmail,
      role: 'Chief Editor',
      bio: 'Official GoalRush Editorial Account',
    });

    user = await User.create({
      email: adminEmail,
      passwordHash,
      author: author._id,
      role: 'admin',
    });

    author.user = user._id;
    await author.save(); 
    
    // Return a success response
    return NextResponse.json({
      success: true,
      message: 'Admin User & Author Profile created successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}