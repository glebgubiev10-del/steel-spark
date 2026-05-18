import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const items = await db.cartItem.findMany({
      where: { sessionId },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { id: 'asc' },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, productId, quantity } = body

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'sessionId and productId are required' },
        { status: 400 }
      )
    }

    // Check if the product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if the item already exists in the cart
    const existingItem = await db.cartItem.findFirst({
      where: { sessionId, productId },
    })

    if (existingItem) {
      // Increment quantity
      const updatedItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (quantity || 1),
        },
        include: {
          product: {
            include: { category: true },
          },
        },
      })

      return NextResponse.json({ item: updatedItem })
    }

    // Create new cart item
    const newItem = await db.cartItem.create({
      data: {
        sessionId,
        productId,
        quantity: quantity || 1,
      },
      include: {
        product: {
          include: { category: true },
        },
      },
    })

    return NextResponse.json({ item: newItem }, { status: 201 })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, cartItemId, quantity } = body

    if (!sessionId || !cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'sessionId, cartItemId, and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity < 1) {
      return NextResponse.json(
        { error: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Verify the cart item belongs to the session
    const existingItem = await db.cartItem.findFirst({
      where: { id: cartItemId, sessionId },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    const updatedItem = await db.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
      include: {
        product: {
          include: { category: true },
        },
      },
    })

    return NextResponse.json({ item: updatedItem })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, cartItemId } = body

    if (!sessionId || !cartItemId) {
      return NextResponse.json(
        { error: 'sessionId and cartItemId are required' },
        { status: 400 }
      )
    }

    // Verify the cart item belongs to the session
    const existingItem = await db.cartItem.findFirst({
      where: { id: cartItemId, sessionId },
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    await db.cartItem.delete({
      where: { id: cartItemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
