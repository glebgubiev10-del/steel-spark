import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    // Build filter conditions
    const where: Record<string, unknown> = {}

    // Category filter
    const category = searchParams.get('category')
    if (category) {
      where.category = { slug: category }
    }

    // Search filter (name or description)
    const search = searchParams.get('search')
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Brand filter
    const brand = searchParams.get('brand')
    if (brand) {
      where.brand = brand
    }

    // In-stock filter
    const inStock = searchParams.get('inStock')
    if (inStock !== null) {
      where.inStock = inStock === 'true'
    }

    // New products filter
    const isNew = searchParams.get('isNew')
    if (isNew !== null) {
      where.isNew = isNew === 'true'
    }

    // Hit products filter
    const isHit = searchParams.get('isHit')
    if (isHit !== null) {
      where.isHit = isHit === 'true'
    }

    // Price range filters
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      const priceFilter: Record<string, number> = {}
      if (minPrice) priceFilter.gte = parseFloat(minPrice)
      if (maxPrice) priceFilter.lte = parseFloat(maxPrice)
      where.price = priceFilter
    }

    // Sorting
    const sort = searchParams.get('sort') || 'newest'
    type OrderBy = Record<string, 'asc' | 'desc'>
    let orderBy: OrderBy = { createdAt: 'desc' }

    switch (sort) {
      case 'price-asc':
        orderBy = { price: 'asc' }
        break
      case 'price-desc':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'name':
        orderBy = { name: 'asc' }
        break
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' }
        break
    }

    // Get total count
    const total = await db.product.count({ where })

    // Fetch products
    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy,
    })

    return NextResponse.json({ products, total })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
