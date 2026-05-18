'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Wrench, Zap, TreePine, Building2, CircleDot } from 'lucide-react'

const brands = [
  'Bosch', 'Makita', 'DeWalt', 'Husqvarna', 'Stihl', 'Stanley',
  'Matrix', 'Knipex', 'Fubag', 'Hyundai', 'Арсенал', 'Distar',
  'Luga', 'Sia', 'Лебедянь', 'Sokol', 'Wacker Neuson',
]

export interface FilterState {
  category: string | null
  minPrice: string
  maxPrice: string
  brands: string[]
  inStock: boolean
  isNew: boolean
  isHit: boolean
}

interface FilterPanelProps {
  categories: { id: string; name: string; slug: string; _count: { products: number } }[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApply: () => void
}

const categoryIcons: Record<string, React.ReactNode> = {
  'power-tools': <Zap className="size-4" />,
  'hand-tools': <Wrench className="size-4" />,
  'garden': <TreePine className="size-4" />,
  'construction-equip': <Building2 className="size-4" />,
  'consumables': <CircleDot className="size-4" />,
}

export default function FilterPanel({ categories, filters, onFiltersChange, onApply }: FilterPanelProps) {
  const handleCategoryChange = (slug: string, checked: boolean) => {
    onFiltersChange({
      ...filters,
      category: checked ? slug : null,
    })
  }

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand)
    onFiltersChange({ ...filters, brands: newBrands })
  }

  const resetFilters = () => {
    onFiltersChange({
      category: null,
      minPrice: '',
      maxPrice: '',
      brands: [],
      inStock: false,
      isNew: false,
      isHit: false,
    })
  }

  return (
    <div className="bg-white border border-[#CFD8DC] rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[#37474F]">Фильтры</h2>
        <Button variant="ghost" size="sm" className="text-[#78909C] text-xs h-7" onClick={resetFilters}>
          Сбросить
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'brand', 'stock']} className="w-full">
        {/* Category Filter */}
        <AccordionItem value="category" className="border-b border-[#ECEFF1]">
          <AccordionTrigger className="text-sm font-semibold text-[#37474F] py-3 hover:no-underline">
            Категория
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pb-2">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#ECEFF1] rounded-md px-2 py-1.5 -mx-2"
                >
                  <Checkbox
                    checked={filters.category === cat.slug}
                    onCheckedChange={(checked) => handleCategoryChange(cat.slug, !!checked)}
                  />
                  <span className="flex items-center gap-1.5 text-sm text-[#263238]">
                    {categoryIcons[cat.slug]}
                    {cat.name}
                  </span>
                  <span className="ml-auto text-xs text-[#78909C]">
                    {cat._count.products}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price" className="border-b border-[#ECEFF1]">
          <AccordionTrigger className="text-sm font-semibold text-[#37474F] py-3 hover:no-underline">
            Цена
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2 pb-2">
              <Input
                type="number"
                placeholder="От"
                value={filters.minPrice}
                onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                className="h-8 text-sm border-[#CFD8DC]"
              />
              <span className="text-[#78909C]">-</span>
              <Input
                type="number"
                placeholder="До"
                value={filters.maxPrice}
                onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                className="h-8 text-sm border-[#CFD8DC]"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand Filter */}
        <AccordionItem value="brand" className="border-b border-[#ECEFF1]">
          <AccordionTrigger className="text-sm font-semibold text-[#37474F] py-3 hover:no-underline">
            Бренд
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1.5 pb-2 max-h-64 overflow-y-auto scrollbar-thin">
              {brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#ECEFF1] rounded-md px-2 py-1 -mx-2"
                >
                  <Checkbox
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) => handleBrandChange(brand, !!checked)}
                  />
                  <span className="text-sm text-[#263238]">{brand}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stock & Special Filters */}
        <AccordionItem value="stock" className="border-b-0">
          <AccordionTrigger className="text-sm font-semibold text-[#37474F] py-3 hover:no-underline">
            Наличие и спецпредложения
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2.5 pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.inStock}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, inStock: !!checked })}
                />
                <span className="text-sm text-[#263238]">Только в наличии</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.isNew}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, isNew: !!checked })}
                />
                <span className="text-sm text-[#263238]">Показать новинки</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={filters.isHit}
                  onCheckedChange={(checked) => onFiltersChange({ ...filters, isHit: !!checked })}
                />
                <span className="text-sm text-[#263238]">Показать хиты</span>
              </label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator className="my-4 bg-[#ECEFF1]" />

      <Button
        onClick={onApply}
        className="w-full bg-[#37474F] hover:bg-[#263238] text-white font-medium"
      >
        Применить
      </Button>
    </div>
  )
}
