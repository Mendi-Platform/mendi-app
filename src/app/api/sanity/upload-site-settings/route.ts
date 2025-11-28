import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/writeClient';
import fs from 'fs';
import path from 'path';

interface ImageUpload {
  fieldName: string;
  imagePath: string;
}

// Images to upload to site settings
const imageUploads: ImageUpload[] = [
  { fieldName: 'logo', imagePath: 'logo/mendi-app.svg' },
  { fieldName: 'questionIcon', imagePath: 'icons/question-icon.svg' },
  { fieldName: 'cartIcon', imagePath: 'icons/cart-icon.svg' },
];

export async function POST() {
  if (!process.env.SANITY_EDITOR_TOKEN) {
    return NextResponse.json(
      { error: 'SANITY_EDITOR_TOKEN not configured' },
      { status: 500 }
    );
  }

  const results: { fieldName: string; status: string; assetId?: string; error?: string }[] = [];
  const assetsDir = path.join(process.cwd(), 'src/app/assets');

  // First, get the siteSettings document ID
  let siteSettingsId: string;
  try {
    const siteSettingsDocs = await writeClient.fetch(`*[_type == "siteSettings"][0]._id`);

    if (!siteSettingsDocs) {
      return NextResponse.json(
        { error: 'No siteSettings document found. Please create one in Sanity Studio first.' },
        { status: 404 }
      );
    }

    siteSettingsId = siteSettingsDocs;
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch siteSettings: ${error}` },
      { status: 500 }
    );
  }

  for (const upload of imageUploads) {
    const imagePath = path.join(assetsDir, upload.imagePath);

    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        results.push({
          fieldName: upload.fieldName,
          status: 'skipped',
          error: `File not found: ${upload.imagePath}`,
        });
        continue;
      }

      // Read the file
      const imageBuffer = fs.readFileSync(imagePath);
      const filename = path.basename(imagePath);

      // Upload to Sanity
      const asset = await writeClient.assets.upload('image', imageBuffer, {
        filename,
      });

      // Update the siteSettings document with the image reference
      await writeClient
        .patch(siteSettingsId)
        .set({
          [upload.fieldName]: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();

      results.push({
        fieldName: upload.fieldName,
        status: 'success',
        assetId: asset._id,
      });
    } catch (error) {
      results.push({
        fieldName: upload.fieldName,
        status: 'error',
        error: String(error),
      });
    }
  }

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return NextResponse.json({
    message: `Uploaded ${successCount} images to site settings, ${errorCount} errors`,
    siteSettingsId,
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to upload site settings images',
    instructions: 'Run: curl -X POST http://localhost:3000/api/sanity/upload-site-settings',
  });
}
