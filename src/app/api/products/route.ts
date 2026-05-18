import { products, type Product } from '@/lib/data'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl

    let filtered: Product[] = [...products]

    // Category filter
    const category = searchParams.get('category')
    if (category) {
      filtered = filtered.filter((p) => p.category.slug === category)
    }

    // Search filter (name or description)
    const search = searchParams.get('search')
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    // Brand filter (single brand from query)
    const brand = searchParams.get('brand')
    if (brand) {
      filtered = filtered.filter((p) => p.brand === brand)
    }

    // Price range filters
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice))
    }

    // In-stock filter
    const inStock = searchParams.get('inStock')
    if (inStock === 'true') {
      filtered = filtered.filter((p) => p.inStock)
    }

    // New products filter
    const isNew = searchParams.get('isNew')
    if (isNew === 'true') {
      filtered = filtered.filter((p) => p.isNew)
    }

    // Hit products filter
    const isHit = searchParams.get('isHit')
    if (isHit === 'true') {
      filtered = filtered.filter((p) => p.isHit)
    }

    // Sorting
    const sort = searchParams.get('sort') || 'newest'
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        break
      case 'newest':
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return NextResponse.json({ products: filtered, total: filtered.length })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
