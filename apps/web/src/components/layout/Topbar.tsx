import { useEffect, useState } from 'react'
import { Icon } from '@/components/ui/Icon'

interface TopbarProps {
  title: string
  sub?: string
  actions?: React.ReactNode
}

export function Topbar({ title, sub, actions }: TopbarProps) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000)
    return () => clearInterval(id)
  }, [])

  const d = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })
  const dateStr = d.charAt(0).toUpperCase() + d.slice(1)

  return (
    <div className="topbar">
      <div>
        <div className="page-title">{title}</div>
        <div className="page-sub">{sub ?? `${dateStr} · Bogotá, D.C.`}</div>
      </div>
      <div className="topbar-actions">
        <div className="search-box">
          <span style={{ color: 'var(--text-3)' }}><Icon name="search" size={14} /></span>
          <input placeholder="Buscar productos, ventas, clientes…" />
          <span className="kbd">⌘K</span>
        </div>
        <button className="icon-btn" title="Notificaciones">
          <Icon name="bell" size={16} />
          <span className="dot" />
        </button>
        {actions}
      </div>
    </div>
  )
}
