import { NextResponse } from 'next/server'

// Tweet model has been removed from the schema.
// This endpoint returns an empty array for backward compatibility.

export async function GET() {
  return NextResponse.json([])
}
