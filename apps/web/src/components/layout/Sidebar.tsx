import { Icon } from '@/components/ui/Icon'
import type { PageId } from '@/types'

interface NavItem {
  id: PageId
  label: string
  icon: string
  shortcut?: string
  badge?: { type: string; text: string }
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Resumen', icon: 'dashboard' },
  { id: 'pos', label: 'Punto de venta', icon: 'pos', shortcut: 'V' },
  { id: 'products', label: 'Productos', icon: 'products' },
  { id: 'inventory', label: 'Inventario', icon: 'inventory', badge: { type: 'warn', text: '5' } },
  { id: 'purchases', label: 'Compras', icon: 'purchases', badge: { type: 'warn', text: '2' } },
  { id: 'employees', label: 'Empleados', icon: 'employees' },
  { id: 'reports', label: 'Finanzas', icon: 'reports' },
]

interface SidebarProps {
  current: PageId
  onNavigate: (id: PageId) => void
}

export function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">A</div>
        <div className="brand-text">
          <div className="brand-name">Aurora</div>
          <div className="brand-sub">POS · v2.4</div>
        </div>
      </div>

      <div className="nav-section">Operaciones</div>
      {NAV_ITEMS.slice(0, 2).map((item) => (
        <button
          key={item.id}
          className={`nav-item ${current === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon"><Icon name={item.icon} /></span>
          <span>{item.label}</span>
          {item.shortcut && <span className="kbd" style={{ marginLeft: 'auto' }}>{item.shortcut}</span>}
        </button>
      ))}

      <div className="nav-section">Gestión</div>
      {NAV_ITEMS.slice(2, 6).map((item) => (
        <button
          key={item.id}
          className={`nav-item ${current === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon"><Icon name={item.icon} /></span>
          <span>{item.label}</span>
          {item.badge && (
            <span className={`nav-badge ${item.badge.type}`}>{item.badge.text}</span>
          )}
        </button>
      ))}

      <div className="nav-section">Insights</div>
      {NAV_ITEMS.slice(6).map((item) => (
        <button
          key={item.id}
          className={`nav-item ${current === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon"><Icon name={item.icon} /></span>
          <span>{item.label}</span>
        </button>
      ))}

      <div className="sidebar-foot">
        <div className="user-chip">
          <div className="avatar">DT</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">Daniela Torres</div>
            <div className="user-role">Administradora · Centro</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
