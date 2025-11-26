import { NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { allSeedData } from '@/sanity/lib/seed'

interface SanityDocument {
  _type: string
  _id: string
  [key: string]: unknown
}

export async function POST() {
  // Check if API token is configured
  if (!process.env.SANITY_EDITOR_TOKEN) {
    return NextResponse.json(
      {
        error: 'SANITY_EDITOR_TOKEN not configured',
        instructions: 'Please add SANITY_EDITOR_TOKEN to your .env file. Generate a token at https://www.sanity.io/manage'
      },
      { status: 500 }
    )
  }

  try {
    const results: { _id: string; _type: string }[] = []

    // Import all seed data using createOrReplace
    for (const doc of allSeedData as SanityDocument[]) {
      const result = await writeClient.createOrReplace(doc)
      results.push({ _id: result._id, _type: result._type })
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${results.length} documents`,
      documents: results
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to seed data',
    instructions: 'Run: curl -X POST http://localhost:3000/api/sanity/seed'
  })
}
