import { products } from '@/lib/data'
import { NextRequest, NextResponse } from 'next/server'

/* ============================================
   КОРЗИНА — КЛИЕНТСКОЕ ХРАНИЛИЩЕ
   API оставлен для совместимости, но данные
   берутся из статического каталога
   ============================================ */

export async function GET(request: NextRequest) {
  // Cart is now managed entirely client-side via Zustand
  // This endpoint returns empty array for backward compatibility
  return NextResponse.json({ items: [] })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body

    const product = products.find((p) => p.id === productId)
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        item: {
          id: `cart-${Date.now()}`,
          productId: product.id,
          quantity: 1,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image,
            brand: product.brand,
            inStock: product.inStock,
          },
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}
