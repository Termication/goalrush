import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';


// The Cloudinary config is automatically read from the CLOUDINARY_URL
// environment variable. No manual parsing or configuration is needed.

export async function POST(req: Request) {
  // Security Check: Ensure the user is authenticated before allowing uploads
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
  }

  try {
    // Convert the file to a buffer to be sent to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use a Promise to handle the upload stream from Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {

          // The upload is already signed because this is a server-side route.
          tags: ['article-image'],
          folder: 'goalrush-articles',
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      ).end(buffer);
    });

    // Return the secure URL of the uploaded image
    return NextResponse.json({ success: true, data: { secure_url: uploadResult.secure_url } });

  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Upload failed' }, { status: 500 });
  }
}
