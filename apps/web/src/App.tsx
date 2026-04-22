import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { TweaksPanel, TweaksFab } from '@/components/layout/TweaksPanel'
import { DashboardPage } from '@/pages/Dashboard'
import { POSPage } from '@/pages/POS'
import { ProductsPage } from '@/pages/Products'
import { InventoryPage } from '@/pages/Inventory'
import { PurchasesPage } from '@/pages/Purchases'
import { EmployeesPage } from '@/pages/Employees'
import { ReportsPage } from '@/pages/Reports'
import type { PageId, Tweaks } from '@/types'

const PAGE_META: Record<PageId, { title: string; sub?: string }> = {
  dashboard: { title: 'Resumen' },
  pos: { title: 'Punto de venta', sub: 'Caja en vivo · Mesa 4 activa' },
  products: { title: 'Productos' },
  inventory: { title: 'Inventario' },
  purchases: { title: 'Compras' },
  employees: { title: 'Empleados' },
  reports: { title: 'Finanzas' },
}

const DEFAULT_TWEAKS: Tweaks = {
  theme: 'dark',
  accent: 'green',
  dashLayout: 'cards',
  chartStyle: 'smooth',
  simpleMode: false,
}

export function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS)

  // Apply theme + accent to body
  useEffect(() => {
    document.body.dataset.theme = tweaks.theme
    document.body.dataset.accent = tweaks.accent === 'green' ? '' : tweaks.accent
  }, [tweaks.theme, tweaks.accent])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'd' || e.key === 'D') setPage('dashboard')
      if (e.key === 'v' || e.key === 'V') setPage('pos')
      if (e.key === 't' || e.key === 'T') setTweaksOpen((o) => !o)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const meta = PAGE_META[page]

  return (
    <div className="app">
      <Sidebar current={page} onNavigate={setPage} />
      <main className="main">
        <Topbar title={meta.title} sub={meta.sub} />
        {page === 'dashboard' && <DashboardPage tweaks={tweaks} />}
        {page === 'pos' && <POSPage />}
        {page === 'products' && <ProductsPage tweaks={tweaks} />}
        {page === 'inventory' && <InventoryPage tweaks={tweaks} />}
        {page === 'purchases' && <PurchasesPage tweaks={tweaks} />}
        {page === 'employees' && <EmployeesPage tweaks={tweaks} />}
        {page === 'reports' && <ReportsPage tweaks={tweaks} />}
      </main>

      <TweaksFab onClick={() => setTweaksOpen((o) => !o)} />
      <TweaksPanel open={tweaksOpen} onClose={() => setTweaksOpen(false)} tweaks={tweaks} setTweaks={setTweaks} />
    </div>
  )
}
