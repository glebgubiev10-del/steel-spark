'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Wrench, ShoppingCart } from 'lucide-react'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    oldPrice?: number | null
    image: string
    rating: number
    reviewCount: number
    inStock: boolean
    brand: string
    isNew: boolean
    isHit: boolean
  }
}

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' \u20BD'
}

export default function ProductCard({ product }: ProductCardProps) {
  const { sessionId, setCartItems, cartItems } = useStore()
  const [adding, setAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  const addToCart = async () => {
    setAdding(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: product.id,
          quantity: 1,
        }),
      })
      if (!res.ok) throw new Error('Failed to add')
      const data = await res.json()
      
      // Refresh cart items
      const cartRes = await fetch(`/api/cart?sessionId=${sessionId}`)
      if (cartRes.ok) {
        const cartData = await cartRes.json()
        setCartItems(cartData.items)
      }
      
      toast.success('Товар добавлен в корзину')
    } catch {
      toast.error('Ошибка при добавлении товара')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card className="card-hover group relative overflow-hidden border border-[#CFD8DC] bg-white py-0 gap-0">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#ECEFF1] rounded-t-xl">
        {imgError ? (
          <div className="flex h-full w-full items-center justify-center bg-[#ECEFF1]">
            <Wrench className="size-12 text-[#78909C]" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-[#37474F] text-white border-0 text-[10px] px-2">
              Новинка
            </Badge>
          )}
          {product.isHit && (
            <Badge className="bg-[#FF1744] text-white border-0 text-[10px] px-2">
              Хит
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-[#FF1744] text-white border-0 text-[10px] px-2">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Brand badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90 text-[10px] border-[#CFD8DC] text-[#37474F]">
            {product.brand}
          </Badge>
        </div>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-xl">
            <span className="bg-white/90 text-[#37474F] font-semibold text-sm px-3 py-1.5 rounded">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col gap-2">
        {/* Name */}
        <h3 className="text-sm font-medium text-[#263238] line-clamp-2 min-h-[2.5rem] leading-5">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-3.5 ${
                  star <= Math.round(product.rating)
                    ? 'fill-[#FFB300] text-[#FFB300]'
                    : 'fill-[#CFD8DC] text-[#CFD8DC]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-[#78909C]">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-[#263238]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-sm text-[#78909C] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <Button
          onClick={addToCart}
          disabled={!product.inStock || adding}
          className="mt-2 w-full bg-[#FF1744] hover:bg-[#D50032] text-white font-medium text-sm h-9"
        >
          <ShoppingCart className="size-4" />
          {adding ? 'Добавление...' : 'В корзину'}
        </Button>
      </CardContent>
    </Card>
  )
}
