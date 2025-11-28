import { NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/writeClient';
import fs from 'fs';
import path from 'path';

interface ImageMapping {
  documentId: string;
  documentType: string;
  fieldName: string;
  imagePath: string;
}

// Map of images to upload and which documents they belong to
const imageMapping: ImageMapping[] = [
  // Garment icons
  { documentId: 'garment-upper', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/shirt.png' },
  { documentId: 'garment-lower', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/pants.png' },
  { documentId: 'garment-kjole', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/dress.png' },
  { documentId: 'garment-dress', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/suit.png' },
  { documentId: 'garment-outerwear', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/jacket.png' },
  { documentId: 'garment-leather', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/leather.svg' },
  { documentId: 'garment-curtains', documentType: 'garment', fieldName: 'icon', imagePath: 'icons/curtain.svg' },

  // Garment damage marker images - Front
  { documentId: 'garment-upper', documentType: 'garment', fieldName: 'damageMarkerFront', imagePath: 'icons/mark-damage/front-top.svg' },
  { documentId: 'garment-lower', documentType: 'garment', fieldName: 'damageMarkerFront', imagePath: 'icons/mark-damage/front-bottom.svg' },
  { documentId: 'garment-kjole', documentType: 'garment', fieldName: 'damageMarkerFront', imagePath: 'icons/mark-damage/front-dress.svg' },
  { documentId: 'garment-dress', documentType: 'garment', fieldName: 'damageMarkerFront', imagePath: 'icons/mark-damage/front-suit.svg' },
  { documentId: 'garment-outerwear', documentType: 'garment', fieldName: 'damageMarkerFront', imagePath: 'icons/mark-damage/front-coat.svg' },

  // Garment damage marker images - Back
  { documentId: 'garment-upper', documentType: 'garment', fieldName: 'damageMarkerBack', imagePath: 'icons/mark-damage/back-top.svg' },
  { documentId: 'garment-lower', documentType: 'garment', fieldName: 'damageMarkerBack', imagePath: 'icons/mark-damage/back-bottom.svg' },
  { documentId: 'garment-kjole', documentType: 'garment', fieldName: 'damageMarkerBack', imagePath: 'icons/mark-damage/back-dress.svg' },
  { documentId: 'garment-dress', documentType: 'garment', fieldName: 'damageMarkerBack', imagePath: 'icons/mark-damage/back-suit.svg' },
  { documentId: 'garment-outerwear', documentType: 'garment', fieldName: 'damageMarkerBack', imagePath: 'icons/mark-damage/back-coat.svg' },

  // Site settings branding - Note: Run upload-site-settings separately after creating the siteSettings document
  // { documentId: 'site-settings-id', documentType: 'siteSettings', fieldName: 'logo', imagePath: 'logo/mendi-app.svg' },
  // { documentId: 'site-settings-id', documentType: 'siteSettings', fieldName: 'questionIcon', imagePath: 'icons/question-icon.svg' },
  // { documentId: 'site-settings-id', documentType: 'siteSettings', fieldName: 'cartIcon', imagePath: 'icons/cart-icon.svg' },

  // Delivery option logos
  { documentId: 'delivery-posten', documentType: 'deliveryOption', fieldName: 'logo', imagePath: 'icons/posten-logo.svg' },

  // Posten option logos
  { documentId: 'posten-small', documentType: 'postenOption', fieldName: 'logo', imagePath: 'icons/posten-logo.svg' },
  { documentId: 'posten-large', documentType: 'postenOption', fieldName: 'logo', imagePath: 'icons/posten-logo.svg' },
];

export async function POST() {
  if (!process.env.SANITY_EDITOR_TOKEN) {
    return NextResponse.json(
      { error: 'SANITY_EDITOR_TOKEN not configured' },
      { status: 500 }
    );
  }

  const results: { documentId: string; status: string; assetId?: string; error?: string }[] = [];
  const assetsDir = path.join(process.cwd(), 'src/app/assets');

  for (const mapping of imageMapping) {
    const imagePath = path.join(assetsDir, mapping.imagePath);

    try {
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        results.push({
          documentId: mapping.documentId,
          status: 'skipped',
          error: `File not found: ${mapping.imagePath}`,
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

      // Update the document with the image reference
      await writeClient
        .patch(mapping.documentId)
        .set({
          [mapping.fieldName]: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          },
        })
        .commit();

      results.push({
        documentId: mapping.documentId,
        status: 'success',
        assetId: asset._id,
      });
    } catch (error) {
      results.push({
        documentId: mapping.documentId,
        status: 'error',
        error: String(error),
      });
    }
  }

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;

  return NextResponse.json({
    message: `Uploaded ${successCount} images, ${errorCount} errors`,
    results,
  });
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to upload images',
    instructions: 'Run: curl -X POST http://localhost:3000/api/sanity/upload-images',
  });
}
