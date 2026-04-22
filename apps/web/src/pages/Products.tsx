import { useState } from 'react'
import { MiniStat } from '@/components/shared/KPI'
import { Icon } from '@/components/ui/Icon'
import { POS_DATA } from '@/data'
import { fmtCOP, fmtNum } from '@/lib/formatters'
import type { Tweaks } from '@/types'
import { SimpleProductsPage } from './simple/SimpleProducts'

function CatChip({ active, onClick, label, count, color, icon }: { active: boolean; onClick: () => void; label: string; count: number; color: string; icon?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 100,
      background: active ? 'var(--text)' : 'var(--surface)',
      color: active ? 'var(--bg)' : 'var(--text-2)',
      border: `1px solid ${active ? 'var(--text)' : 'var(--border)'}`,
      display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5,
      whiteSpace: 'nowrap', fontWeight: 500, transition: 'all 0.2s',
    }}>
      {icon && <span style={{ color: active ? 'var(--bg)' : color, fontSize: 10 }}>{icon}</span>}
      {label}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: active ? 'rgba(0,0,0,0.14)' : 'var(--bg-3)', padding: '1px 6px', borderRadius: 100 }}>{count}</span>
    </button>
  )
}

interface Props { tweaks: Tweaks }

export function ProductsPage({ tweaks }: Props) {
  if (tweaks.simpleMode) return <SimpleProductsPage />
  const data = POS_DATA
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const products = data.PRODUCTOS.filter((p) => {
    if (activeCat !== 'all' && p.cat !== activeCat) return false
    if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalValor = data.PRODUCTOS.reduce((s, p) => s + p.stock * p.costo, 0)
  const agotados = data.PRODUCTOS.filter((p) => p.stock < 10).length

  return (
    <div className="page fade-in">
      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <MiniStat label="SKUs activos" value={data.PRODUCTOS.length} icon="boxes" />
        <MiniStat label="Valor inventario" value={totalValor} formatter={fmtCOP} icon="package" />
        <MiniStat label="Categorías" value={data.CATEGORIAS.length} icon="target" />
        <MiniStat label="Stock crítico" value={agotados} icon="alert" danger />
      </div>

      <div style={{ display: 'flex', gap: 10, margin: '20px 0 14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <CatChip active={activeCat === 'all'} onClick={() => setActiveCat('all')} label="Todo" count={data.PRODUCTOS.length} color="var(--text)" />
          {data.CATEGORIAS.map((c) => (
            <CatChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} label={c.nombre} count={data.PRODUCTOS.filter((p) => p.cat === c.id).length} color={c.color} icon={c.icon} />
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <div className="search-box">
            <Icon name="search" size={14} />
            <input placeholder="Buscar…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="seg">
            <button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}><Icon name="boxes" size={12} /></button>
            <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}><Icon name="filter" size={12} /></button>
          </div>
          <button className="btn primary"><Icon name="plus" size={13} /> Nuevo producto</button>
        </div>
      </div>

      {view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }} className="stagger">
          {products.map((p) => {
            const cat = data.CATEGORIAS.find((c) => c.id === p.cat)!
            const margen = ((p.precio - p.costo) / p.precio * 100)
            const stock_pct = Math.min(100, (p.stock / 200) * 100)
            return (
              <div key={p.id} className="card" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: cat.color + '22', color: cat.color, display: 'grid', placeItems: 'center', fontSize: 22, flexShrink: 0 }}>
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.3 }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{cat.nombre} · {p.proveedor}</div>
                  </div>
                  <span className={`pill ${p.tendencia === 'up' ? 'ok' : p.tendencia === 'down' ? 'danger' : ''}`}>
                    <Icon name={p.tendencia === 'up' ? 'trendUp' : p.tendencia === 'down' ? 'trendDown' : 'minus'} size={10} />
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Precio</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginTop: 2 }}>{fmtCOP(p.precio)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Margen</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, marginTop: 2, color: margen > 50 ? 'var(--accent)' : margen > 30 ? 'var(--warn)' : 'var(--danger)' }}>{margen.toFixed(0)}%</div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: 'var(--text-3)' }}>Stock: {p.stock} {p.unidad}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{fmtNum(p.vendidos30d)} vendidos/mes</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${stock_pct}%`, background: p.stock < 10 ? 'var(--danger)' : p.stock < 20 ? 'var(--warn)' : 'var(--accent)' }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th style={{ textAlign: 'right' }}>Precio</th>
                <th style={{ textAlign: 'right' }}>Costo</th>
                <th style={{ textAlign: 'right' }}>Margen</th>
                <th style={{ textAlign: 'right' }}>Stock</th>
                <th style={{ textAlign: 'right' }}>Vendidos/mes</th>
                <th>Tendencia</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const cat = data.CATEGORIAS.find((c) => c.id === p.cat)!
                const margen = ((p.precio - p.costo) / p.precio * 100)
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                        {p.nombre}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-2)' }}>{cat.nombre}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmtCOP(p.precio)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: 'var(--text-3)' }}>{fmtCOP(p.costo)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: margen > 50 ? 'var(--accent)' : margen > 30 ? 'var(--warn)' : 'var(--danger)' }}>{margen.toFixed(0)}%</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: p.stock < 10 ? 'var(--danger)' : p.stock < 20 ? 'var(--warn)' : 'var(--text)' }}>{p.stock}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmtNum(p.vendidos30d)}</td>
                    <td>
                      <span className={`pill ${p.tendencia === 'up' ? 'ok' : p.tendencia === 'down' ? 'danger' : ''}`}>
                        <Icon name={p.tendencia === 'up' ? 'arrowUp' : p.tendencia === 'down' ? 'arrowDown' : 'minus'} size={10} />
                        {p.tendencia}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
