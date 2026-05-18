import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/data'

export type Page = 'home' | 'catalog' | 'about' | 'contacts' | 'cart'

export interface CartItemType {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    image: string
    brand: string
    inStock: boolean
  }
}

interface StoreState {
  // Navigation
  currentPage: Page
  setCurrentPage: (page: Page) => void

  // Category filter for catalog
  selectedCategory: string | null
  setSelectedCategory: (slug: string | null) => void

  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Cart (fully client-side)
  cartItems: CartItemType[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number
  cartCount: () => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: 'home' as Page,
      setCurrentPage: (page) => {
        set({ currentPage: page })
        window.scrollTo({ top: 0, behavior: 'smooth' })
      },

      // Category filter
      selectedCategory: null,
      setSelectedCategory: (slug) => set({ selectedCategory: slug }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Cart
      cartItems: [],
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),

      addToCart: (product: Product) => {
        const { cartItems } = get()
        const existingItem = cartItems.find(
          (item) => item.productId === product.id
        )

        if (existingItem) {
          set({
            cartItems: cartItems.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
        } else {
          const newItem: CartItemType = {
            id: `cart-${Date.now()}-${product.id}`,
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
          }
          set({ cartItems: [...cartItems, newItem] })
        }
      },

      removeFromCart: (cartItemId: string) => {
        set({ cartItems: get().cartItems.filter((item) => item.id !== cartItemId) })
      },

      updateQuantity: (cartItemId: string, quantity: number) => {
        if (quantity < 1) return
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ cartItems: [] }),

      cartTotal: () => {
        const { cartItems } = get()
        return cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },

      cartCount: () => {
        const { cartItems } = get()
        return cartItems.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'staliskra-cart',
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    }
  )
)
