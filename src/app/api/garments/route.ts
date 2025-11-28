import { NextResponse } from 'next/server';
import { getGarments } from '@/sanity/lib/queries';

export async function GET() {
  try {
    const garments = await getGarments();
    return NextResponse.json(garments);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch garments' },
      { status: 500 }
    );
  }
}
