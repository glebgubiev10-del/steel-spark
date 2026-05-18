import { create } from 'zustand'

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

  // Cart
  cartItems: CartItemType[]
  cartOpen: boolean
  sessionId: string
  setCartOpen: (open: boolean) => void
  setCartItems: (items: CartItemType[]) => void
  cartTotal: () => number
  cartCount: () => number
}

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const useStore = create<StoreState>((set, get) => ({
  // Navigation
  currentPage: 'home',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Category filter
  selectedCategory: null,
  setSelectedCategory: (slug) => set({ selectedCategory: slug }),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Cart
  cartItems: [],
  cartOpen: false,
  sessionId: generateSessionId(),
  setCartOpen: (open) => set({ cartOpen: open }),
  setCartItems: (items) => set({ cartItems: items }),
  cartTotal: () => {
    const { cartItems } = get()
    return cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  },
  cartCount: () => {
    const { cartItems } = get()
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  },
}))
