import { categories } from '@/lib/data'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
