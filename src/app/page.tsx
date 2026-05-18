'use client'

import { useEffect, useState, useCallback } from 'react'
import { useStore, type CartItemType, type Page } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ChevronRight,
  Home as HomeIcon,
  Search,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Wrench,
  Zap,
  TreePine,
  Building2,
  CircleDot,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'

import Header from '@/components/store/Header'
import Footer from '@/components/store/Footer'
import HeroSection from '@/components/store/HeroSection'
import ProductCard from '@/components/store/ProductCard'
import CartSidebar from '@/components/store/CartSidebar'
import FilterPanel, { type FilterState } from '@/components/store/FilterPanel'

/* ============================================
   SHARED HELPERS
   ============================================ */

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU').replace(/,/g, ' ') + ' \u20BD'
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  oldPrice: number | null
  image: string
  rating: number
  reviewCount: number
  inStock: boolean
  brand: string
  isNew: boolean
  isHit: boolean
  category: { id: string; name: string; slug: string }
}

const categoryIcons: Record<string, React.ReactNode> = {
  'power-tools': <Zap className="size-8 text-[#37474F]" />,
  'hand-tools': <Wrench className="size-8 text-[#37474F]" />,
  'garden': <TreePine className="size-8 text-[#37474F]" />,
  'construction-equip': <Building2 className="size-8 text-[#37474F]" />,
  'consumables': <CircleDot className="size-8 text-[#37474F]" />,
}

/* ============================================
   BREADCRUMBS COMPONENT
   ============================================ */

function Breadcrumbs({ items }: { items: { label: string; page?: Page }[] }) {
  const { setCurrentPage } = useStore()

  return (
    <nav className="flex items-center gap-1.5 text-sm text-[#78909C] mb-6" aria-label="Хлебные крошки">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="size-3.5" />}
          {item.page ? (
            <button
              onClick={() => setCurrentPage(item.page!)}
              className="hover:text-[#37474F] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[#263238] font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

/* ============================================
   SECTION TITLE COMPONENT
   ============================================ */

function SectionTitle({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#263238]">{title}</h2>
      {actionLabel && onAction && (
        <Button variant="ghost" className="text-[#FF1744] hover:text-[#D50032] text-sm font-medium" onClick={onAction}>
          {actionLabel}
          <ArrowRight className="size-4 ml-1" />
        </Button>
      )}
    </div>
  )
}

/* ============================================
   HOME PAGE
   ============================================ */

function HomePage() {
  const { setCurrentPage, setSelectedCategory } = useStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [hitProducts, setHitProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [catRes, hitRes, newRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?isHit=true'),
          fetch('/api/products?isNew=true'),
        ])
        if (catRes.ok) {
          const catData = await catRes.json()
          setCategories(catData.categories)
        }
        if (hitRes.ok) {
          const hitData = await hitRes.json()
          setHitProducts(hitData.products.slice(0, 4))
        }
        if (newRes.ok) {
          const newData = await newRes.json()
          setNewProducts(newData.products.slice(0, 4))
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug)
    setCurrentPage('catalog')
  }

  return (
    <div>
      {/* Hero */}
      <HeroSection />

      {/* Popular Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <SectionTitle
          title="Популярные категории"
          actionLabel="Все категории"
          onAction={() => setCurrentPage('catalog')}
        />
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className="card-hover cursor-pointer border-[#CFD8DC] bg-white py-0 gap-0 overflow-hidden"
                onClick={() => handleCategoryClick(cat.slug)}
              >
                <div className="aspect-[4/3] bg-[#ECEFF1] flex items-center justify-center overflow-hidden">
                  <img
                    src={`/categories/${cat.slug}.png`}
                    alt={cat.name}
                    className="h-full w-full object-contain p-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
                <CardContent className="p-3 sm:p-4 text-center">
                  <h3 className="text-sm font-semibold text-[#263238] mb-1">{cat.name}</h3>
                  <p className="text-xs text-[#78909C]">{cat._count.products} товаров</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Hit Products */}
      <section className="bg-[#ECEFF1] py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            title="Хиты продаж"
            actionLabel="Все хиты"
            onAction={() => {
              setSelectedCategory(null)
              setCurrentPage('catalog')
            }}
          />
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : hitProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {hitProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-[#78909C] text-center py-8">Хиты продаж скоро появятся</p>
          )}
        </div>
      </section>

      {/* New Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <SectionTitle
          title="Новинки"
          actionLabel="Все новинки"
          onAction={() => {
            setSelectedCategory(null)
            setCurrentPage('catalog')
          }}
        />
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : newProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-[#78909C] text-center py-8">Новинки скоро появятся</p>
        )}
      </section>

      {/* CTA Banner */}
      <section className="steel-gradient py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Не нашли нужный инструмент?
          </h2>
          <p className="text-[#B0BEC5] mb-6 max-w-lg mx-auto">
            Позвоните нам, и наши специалисты помогут подобрать оптимальное решение для ваших задач
          </p>
          <a
            href="tel:+78005553535"
            className="inline-flex items-center gap-2 text-2xl font-bold text-white hover:text-[#FF1744] transition-colors"
          >
            <Phone className="size-6" />
            +7 (800) 555-35-35
          </a>
        </div>
      </section>
    </div>
  )
}

/* ============================================
   CATALOG PAGE
   ============================================ */

function CatalogPage() {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('newest')
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: selectedCategory,
    minPrice: '',
    maxPrice: '',
    brands: [],
    inStock: false,
    isNew: false,
    isHit: false,
  })

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories))
      .catch(() => {})
  }, [])

  // Build query string from filters
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (searchQuery) params.set('search', searchQuery)
    if (filters.brands.length === 1) params.set('brand', filters.brands[0])
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.inStock) params.set('inStock', 'true')
    if (filters.isNew) params.set('isNew', 'true')
    if (filters.isHit) params.set('isHit', 'true')
    if (sort) params.set('sort', sort)
    return params.toString()
  }, [filters, searchQuery, sort])

  // Fetch products when filters change
  useEffect(() => {
    let cancelled = false
    const query = buildQuery()
    fetch(`/api/products?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products)
          setTotal(data.total)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [buildQuery])

  // Sync selectedCategory from store
  useEffect(() => {
    if (selectedCategory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilters((prev) => ({ ...prev, category: selectedCategory }))
      setSelectedCategory(null)
    }
  }, [selectedCategory, setSelectedCategory])

  const handleApplyFilters = () => {
    setMobileFiltersOpen(false)
  }

  // For multiple brands, we need client-side filtering since API only supports single brand
  const displayProducts = filters.brands.length > 1
    ? products.filter((p) => filters.brands.includes(p.brand))
    : products

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Главная', page: 'home' }, { label: 'Каталог' }]} />

      <h1 className="text-2xl sm:text-3xl font-bold text-[#263238] mb-6">Каталог товаров</h1>

      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <FilterPanel
            categories={categories}
            filters={filters}
            onFiltersChange={setFilters}
            onApply={handleApplyFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="lg:hidden border-[#CFD8DC] gap-2"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <Filter className="size-4" />
              Фильтры
            </Button>

            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-[#78909C]" />
              <Input
                type="text"
                placeholder="Поиск..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(localSearch)
                  }
                }}
                className="pl-9 h-9 border-[#CFD8DC]"
              />
            </div>

            {/* Sort */}
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-48 h-9 border-[#CFD8DC]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">По новизне</SelectItem>
                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
              </SelectContent>
            </Select>

            {/* Results count */}
            <span className="text-sm text-[#78909C] whitespace-nowrap">
              {loading ? 'Загрузка...' : `${total} товаров`}
            </span>
          </div>

          {/* Mobile Filters (collapsible) */}
          {mobileFiltersOpen && (
            <div className="lg:hidden mb-6">
              <FilterPanel
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
              />
            </div>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Search className="size-12 text-[#78909C] mb-4" />
              <p className="text-lg font-medium text-[#37474F] mb-2">Товары не найдены</p>
              <p className="text-sm text-[#78909C]">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   ABOUT PAGE
   ============================================ */

function AboutPage() {
  const stats = [
    { value: '10+', label: 'лет на рынке' },
    { value: '10 000+', label: 'товаров в каталоге' },
    { value: '50 000+', label: 'довольных клиентов' },
    { value: '200+', label: 'брендов-партнёров' },
  ]

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Breadcrumbs items={[{ label: 'Главная', page: 'home' }, { label: 'О компании' }]} />

        <h1 className="text-2xl sm:text-3xl font-bold text-[#263238] mb-6">О компании СтальИскра</h1>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="flex flex-col gap-4">
            <p className="text-[#37474F] leading-relaxed">
              Компания &laquo;СтальИскра&raquo; работает на рынке строительного инструмента и оборудования с 2015 года. 
              За это время мы зарекомендовали себя как надёжный поставщик качественного инструмента для профессионалов 
              и домашних мастеров.
            </p>
            <p className="text-[#37474F] leading-relaxed">
              В нашем каталоге представлено более 10 000 наименований продукции от ведущих мировых 
              производителей: Bosch, Makita, DeWalt, Husqvarna, Stihl и многих других. Мы тщательно 
              отбираем поставщиков и гарантируем оригинальность каждого товара.
            </p>
            <p className="text-[#37474F] leading-relaxed">
              Наша миссия &mdash; обеспечить каждого мастера, будь то профессионал или любитель, 
              надёжным инструментом, который поможет реализовать любые строительные задачи. 
              Мы верим, что качественный инструмент &mdash; это основа любого успешного проекта.
            </p>
          </div>
          <div className="bg-[#ECEFF1] rounded-xl flex items-center justify-center min-h-[300px]">
            <img
              src="/hero-banner.png"
              alt="СтальИскра"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-[#CFD8DC] bg-white py-0 gap-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-[#FF1744] mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-[#78909C]">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="steel-gradient rounded-xl p-8 sm:p-12 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Наши ценности</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Качество</h3>
              <p className="text-sm text-[#B0BEC5] leading-relaxed">
                Мы работаем только с проверенными поставщиками и гарантируем оригинальность каждого товара. 
                Вся продукция сертифицирована и соответствует стандартам качества.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Надёжность</h3>
              <p className="text-sm text-[#B0BEC5] leading-relaxed">
                Мы дорожим доверием наших клиентов и стремимся обеспечить безупречный сервис на каждом 
                этапе &mdash; от подбора инструмента до послепродажного обслуживания.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Экспертиза</h3>
              <p className="text-sm text-[#B0BEC5] leading-relaxed">
                Наши специалисты &mdash; опытные мастера, которые знают инструмент изнутри. 
                Мы всегда готовы помочь с выбором и ответить на любые вопросы.
              </p>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#263238] mb-6">Наша команда</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Алексей Петров', role: 'Генеральный директор' },
              { name: 'Мария Иванова', role: 'Руководитель отдела продаж' },
              { name: 'Дмитрий Сидоров', role: 'Технический специалист' },
              { name: 'Елена Козлова', role: 'Менеджер по работе с клиентами' },
            ].map((member) => (
              <Card key={member.name} className="border-[#CFD8DC] bg-white py-0 gap-0">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-[#ECEFF1] rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#37474F]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#263238] text-sm">{member.name}</h3>
                  <p className="text-xs text-[#78909C] mt-1">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   CONTACTS PAGE
   ============================================ */

function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success('Сообщение отправлено!')
    setForm({ name: '', email: '', message: '' })
    setSubmitting(false)
  }

  const contactCards = [
    {
      icon: <Phone className="size-6 text-[#37474F]" />,
      title: 'Телефон',
      value: '+7 (800) 555-35-35',
      link: 'tel:+78005553535',
    },
    {
      icon: <Mail className="size-6 text-[#37474F]" />,
      title: 'Электронная почта',
      value: 'info@staliskra.ru',
      link: 'mailto:info@staliskra.ru',
    },
    {
      icon: <MapPin className="size-6 text-[#37474F]" />,
      title: 'Адрес',
      value: 'г. Москва, ул. Строителей, д. 15',
      link: null,
    },
    {
      icon: <Clock className="size-6 text-[#37474F]" />,
      title: 'Режим работы',
      value: 'Пн-Пт: 9:00 - 20:00, Сб: 10:00 - 18:00',
      link: null,
    },
  ]

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Breadcrumbs items={[{ label: 'Главная', page: 'home' }, { label: 'Контакты' }]} />

        <h1 className="text-2xl sm:text-3xl font-bold text-[#263238] mb-6">Контакты</h1>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {contactCards.map((card) => (
            <Card key={card.title} className="border-[#CFD8DC] bg-white py-0 gap-0">
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ECEFF1] mb-3">
                  {card.icon}
                </div>
                <h3 className="text-sm font-semibold text-[#263238] mb-1">{card.title}</h3>
                {card.link ? (
                  <a href={card.link} className="text-sm text-[#37474F] hover:text-[#FF1744] transition-colors">
                    {card.value}
                  </a>
                ) : (
                  <p className="text-sm text-[#37474F]">{card.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="border-[#CFD8DC] bg-white py-0 gap-0">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-[#263238] mb-4">Напишите нам</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-[#37474F] mb-1.5 block">Имя</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ваше имя"
                    required
                    className="border-[#CFD8DC]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#37474F] mb-1.5 block">Электронная почта</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    required
                    className="border-[#CFD8DC]"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#37474F] mb-1.5 block">Сообщение</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Ваше сообщение..."
                    required
                    rows={4}
                    className="border-[#CFD8DC] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#FF1744] hover:bg-[#D50032] text-white font-medium self-start"
                >
                  {submitting ? 'Отправка...' : 'Отправить сообщение'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-[#CFD8DC] bg-white py-0 gap-0 overflow-hidden">
            <div className="h-full min-h-[400px] bg-[#ECEFF1] flex items-center justify-center rounded-xl">
              <div className="text-center">
                <MapPin className="size-12 text-[#78909C] mx-auto mb-3" />
                <p className="text-lg font-medium text-[#78909C]">Карта</p>
                <p className="text-sm text-[#78909C] mt-1">г. Москва, ул. Строителей, д. 15</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ============================================
   CART PAGE
   ============================================ */

function CartPage() {
  const { sessionId, cartItems, setCartItems, cartTotal, cartCount, setCurrentPage } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch(`/api/cart?sessionId=${sessionId}`)
        if (res.ok) {
          const data = await res.json()
          setCartItems(data.items)
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [sessionId, setCartItems])

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) return
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, cartItemId, quantity }),
      })
      if (res.ok) {
        const data = await res.json()
        setCartItems(
          cartItems.map((item) => (item.id === cartItemId ? data.item : item))
        )
      }
    } catch {
      toast.error('Ошибка при обновлении корзины')
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, cartItemId }),
      })
      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== cartItemId))
        toast.success('Товар удалён из корзины')
      }
    } catch {
      toast.error('Ошибка при удалении товара')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <Breadcrumbs items={[{ label: 'Главная', page: 'home' }, { label: 'Корзина' }]} />

        <h1 className="text-2xl sm:text-3xl font-bold text-[#263238] mb-6">Корзина</h1>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ECEFF1] mb-4">
              <ShoppingCart className="size-10 text-[#78909C]" />
            </div>
            <p className="text-lg font-medium text-[#37474F] mb-2">Корзина пуста</p>
            <p className="text-sm text-[#78909C] mb-4">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Button
              onClick={() => setCurrentPage('catalog')}
              className="bg-[#FF1744] hover:bg-[#D50032] text-white"
            >
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="flex flex-col gap-3">
                {cartItems.map((item: CartItemType) => (
                  <Card key={item.id} className="border-[#CFD8DC] bg-white py-0 gap-0">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="h-20 w-20 shrink-0 rounded-md bg-[#ECEFF1] overflow-hidden">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="h-full w-full object-contain p-2"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              target.parentElement!.innerHTML = '<div class="flex h-full w-full items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#78909C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>'
                            }}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#263238] line-clamp-2">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[#78909C] mt-0.5">{item.product.brand}</p>

                          <div className="flex items-center justify-between mt-3">
                            {/* Price per unit */}
                            <span className="text-sm text-[#78909C]">
                              {formatPrice(item.product.price)} / шт.
                            </span>

                            {/* Subtotal */}
                            <span className="text-base font-bold text-[#263238]">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-[#CFD8DC]"
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
                                className="h-8 w-8 border-[#CFD8DC]"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>

                            {/* Remove */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#78909C] hover:text-[#FF1744] gap-1"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="size-4" />
                              Удалить
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 shrink-0">
              <Card className="border-[#CFD8DC] bg-white py-0 gap-0 sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-[#263238] mb-4">Итого</h2>
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#78909C]">
                        Товары ({cartCount()})
                      </span>
                      <span className="text-[#263238]">{formatPrice(cartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#78909C]">Доставка</span>
                      <span className="text-[#263238]">Бесплатно</span>
                    </div>
                  </div>
                  <Separator className="my-4 bg-[#ECEFF1]" />
                  <div className="flex justify-between mb-6">
                    <span className="text-base font-bold text-[#263238]">К оплате</span>
                    <span className="text-xl font-bold text-[#FF1744]">{formatPrice(cartTotal())}</span>
                  </div>
                  <Button
                    className="w-full bg-[#FF1744] hover:bg-[#D50032] text-white font-medium h-11"
                    onClick={() => toast.success('Заказ оформлен! Спасибо за покупку!')}
                  >
                    Оформить заказ
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full mt-2 border-[#CFD8DC]"
                    onClick={() => setCurrentPage('catalog')}
                  >
                    Продолжить покупки
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================
   MAIN PAGE
   ============================================ */

export default function Home() {
  const { currentPage } = useStore()

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contacts' && <ContactsPage />}
        {currentPage === 'cart' && <CartPage />}
      </main>
      <Footer />
      <CartSidebar />
    </div>
  )
}
