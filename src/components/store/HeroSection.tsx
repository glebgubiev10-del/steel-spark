'use client'

import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Truck, Shield, Package, Award, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: <Truck className="size-8 text-[#37474F]" />,
    title: 'Быстрая доставка',
    description: 'По всей России',
  },
  {
    icon: <Shield className="size-8 text-[#37474F]" />,
    title: 'Гарантия качества',
    description: 'Оригинальный инструмент',
  },
  {
    icon: <Package className="size-8 text-[#37474F]" />,
    title: 'Большой выбор',
    description: 'Более 10 000 товаров',
  },
  {
    icon: <Award className="size-8 text-[#37474F]" />,
    title: 'Лучшие бренды',
    description: 'Bosch, Makita, DeWalt',
  },
]

export default function HeroSection() {
  const { setCurrentPage } = useStore()

  return (
    <section>
      {/* Hero Banner */}
      <div className="relative w-full min-h-[400px] sm:min-h-[480px] lg:min-h-[540px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero-banner.png"
            alt="СтальИскра"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#37474F]/90 via-[#37474F]/70 to-[#37474F]/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 py-12">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
              СтальИскра
            </h1>
            <p className="text-lg sm:text-xl text-[#B0BEC5] mb-8 leading-relaxed">
              Профессиональный инструмент и оборудование
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setCurrentPage('catalog')}
                className="bg-[#FF1744] hover:bg-[#D50032] text-white font-semibold h-12 px-6 text-base"
              >
                Перейти в каталог
                <ArrowRight className="size-5 ml-1" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage('about')}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white h-12 px-6 text-base bg-transparent"
              >
                О компании
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="card-hover border-[#CFD8DC] bg-white py-0 gap-0">
              <CardContent className="flex flex-col items-center text-center p-4 sm:p-6">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#ECEFF1]">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#263238] mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#78909C]">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
