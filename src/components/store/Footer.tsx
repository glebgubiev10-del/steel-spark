'use client'

import { useStore, type Page } from '@/lib/store'
import { Phone, Mail, MapPin } from 'lucide-react'

const navLinks: { label: string; page: Page }[] = [
  { label: 'Главная', page: 'home' },
  { label: 'Каталог', page: 'catalog' },
  { label: 'О компании', page: 'about' },
  { label: 'Контакты', page: 'contacts' },
]

export default function Footer() {
  const { setCurrentPage } = useStore()

  return (
    <footer className="mt-auto bg-[#37474F] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Left: Logo + Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-store.png" alt="СтальИскра" className="h-9 w-9 object-contain" />
              <span className="text-xl font-bold text-white">СтальИскра</span>
            </div>
            <p className="text-sm text-[#B0BEC5] leading-relaxed">
              Интернет-магазин профессионального строительного инструмента и оборудования. 
              Качественные инструменты для профессионалов и домашних мастеров.
            </p>
          </div>

          {/* Center: Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B0BEC5] mb-4">
              Навигация
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => setCurrentPage(link.page)}
                  className="text-left text-sm text-[#CFD8DC] hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right: Contacts */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#B0BEC5] mb-4">
              Контакты
            </h3>
            <div className="flex flex-col gap-3">
              <a href="tel:+78005553535" className="flex items-center gap-2 text-sm text-[#CFD8DC] hover:text-white transition-colors">
                <Phone className="size-4 shrink-0" />
                +7 (800) 555-35-35
              </a>
              <a href="mailto:info@staliskra.ru" className="flex items-center gap-2 text-sm text-[#CFD8DC] hover:text-white transition-colors">
                <Mail className="size-4 shrink-0" />
                info@staliskra.ru
              </a>
              <div className="flex items-start gap-2 text-sm text-[#CFD8DC]">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                г. Москва, ул. Строителей, д. 15
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#546E7A]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          <p className="text-center text-xs text-[#78909C]">
            &copy; 2024 СтальИскра. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
