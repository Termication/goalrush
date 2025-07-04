import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Parse CLOUDINARY_URL
const parsed = process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);

if (!parsed) {
  throw new Error('❌ Invalid CLOUDINARY_URL format');
}

const [, apiKey, apiSecret, cloudName] = parsed;

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: 'articles',
    });

    return NextResponse.json({ success: true, data: upload });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
