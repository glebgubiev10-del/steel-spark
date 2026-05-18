'use client'

import { useStore, type CartItemType } from '@/lib/store'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, Minus, Plus, Trash2, Wrench } from 'lucide-react'
import { toast } from 'sonner'

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' \u20BD'
}

export default function CartSidebar() {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartCount,
    setCurrentPage,
  } = useStore()

  const goShopping = () => {
    setCartOpen(false)
    setCurrentPage('catalog')
  }

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
    toast.success('Товар удалён из корзины')
  }

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 border-b border-[#CFD8DC]">
          <SheetTitle className="flex items-center gap-2 text-[#37474F]">
            <ShoppingCart className="size-5" />
            Корзина
            {cartCount() > 0 && (
              <span className="text-sm font-normal text-[#78909C]">
                ({cartCount()} {cartCount() === 1 ? 'товар' : cartCount() < 5 ? 'товара' : 'товаров'})
              </span>
            )}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Содержимое вашей корзины
          </SheetDescription>
        </SheetHeader>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ECEFF1]">
              <ShoppingCart className="size-10 text-[#78909C]" />
            </div>
            <p className="text-lg font-medium text-[#37474F]">Корзина пуста</p>
            <p className="text-sm text-[#78909C] text-center">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Button
              onClick={goShopping}
              className="bg-[#FF1744] hover:bg-[#D50032] text-white mt-2"
            >
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-0">
                {cartItems.map((item: CartItemType) => (
                  <div key={item.id} className="flex gap-3 p-4 border-b border-[#ECEFF1]">
                    {/* Item Image */}
                    <div className="h-16 w-16 shrink-0 rounded-md bg-[#ECEFF1] overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-contain p-1"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          target.parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#78909C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>'
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#263238] line-clamp-2 leading-4">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-[#78909C] mt-0.5">
                        {item.product.brand}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-[#CFD8DC]"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-[#CFD8DC]"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <span className="text-sm font-semibold text-[#263238]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 text-[#78909C] hover:text-[#FF1744]"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer with Total */}
            <div className="border-t border-[#CFD8DC] p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[#78909C]">
                  Итого ({cartCount()} {cartCount() === 1 ? 'товар' : cartCount() < 5 ? 'товара' : 'товаров'})
                </span>
                <span className="text-xl font-bold text-[#263238]">
                  {formatPrice(cartTotal())}
                </span>
              </div>
              <Button
                className="w-full bg-[#FF1744] hover:bg-[#D50032] text-white font-medium h-11"
                onClick={() => {
                  toast.success('Заказ оформлен! Спасибо за покупку!')
                  setCartOpen(false)
                }}
              >
                Оформить заказ
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2 border-[#CFD8DC]"
                onClick={() => {
                  setCartOpen(false)
                  setCurrentPage('cart')
                }}
              >
                Перейти в корзину
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
