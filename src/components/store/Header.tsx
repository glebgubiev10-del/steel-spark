'use client'

import { useState } from 'react'
import { useStore, type Page } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Home,
  Grid3X3,
  Info,
  MessageSquare,
} from 'lucide-react'

const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
  { label: 'Главная', page: 'home', icon: <Home className="size-4" /> },
  { label: 'Каталог', page: 'catalog', icon: <Grid3X3 className="size-4" /> },
  { label: 'О компании', page: 'about', icon: <Info className="size-4" /> },
  { label: 'Контакты', page: 'contacts', icon: <MessageSquare className="size-4" /> },
]

export default function Header() {
  const { currentPage, setCurrentPage, searchQuery, setSearchQuery, cartCount, setCartOpen } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localSearch)
    setCurrentPage('catalog')
  }

  const handleNavClick = (page: Page) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#CFD8DC] bg-gradient-to-r from-white to-[#ECEFF1] shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 shrink-0"
        >
          <img
            src="/logo-store.png"
            alt="СтальИскра"
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-bold text-[#37474F] hidden sm:inline">
            СтальИскра
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNavClick(link.page)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-[#ECEFF1] ${
                currentPage === link.page
                  ? 'text-[#37474F]'
                  : 'text-[#78909C] hover:text-[#37474F]'
              }`}
            >
              {link.label}
              {currentPage === link.page && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-[#FF1744] rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Search + Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[#78909C]" />
              <Input
                type="text"
                placeholder="Поиск инструментов..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-48 lg:w-64 pl-9 h-9 bg-white border-[#CFD8DC] text-sm"
              />
            </div>
          </form>

          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="size-5 text-[#37474F]" />
            {cartCount() > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-[#FF1744] text-white border-0 text-[10px] font-bold flex items-center justify-center">
                {cartCount()}
              </Badge>
            )}
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-5 text-[#37474F]" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-4 border-b border-[#CFD8DC]">
            <SheetTitle className="flex items-center gap-2">
              <img src="/logo-store.png" alt="СтальИскра" className="h-8 w-8 object-contain" />
              СтальИскра
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col p-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4 sm:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[#78909C]" />
                <Input
                  type="text"
                  placeholder="Поиск инструментов..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="pl-9 h-9 bg-white border-[#CFD8DC] text-sm"
                />
              </div>
            </form>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'bg-[#ECEFF1] text-[#37474F]'
                      : 'text-[#78909C] hover:bg-[#ECEFF1] hover:text-[#37474F]'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
