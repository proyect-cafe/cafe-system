import { MiniStat } from '@/components/shared/KPI'
import { Icon } from '@/components/ui/Icon'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'
import type { Tweaks } from '@/types'
import { SimpleInventoryPage } from './simple/SimpleInventory'

interface Props { tweaks: Tweaks }

export function InventoryPage({ tweaks }: Props) {
  if (tweaks.simpleMode) return <SimpleInventoryPage />
  const data = POS_DATA

  const totalValor = data.PRODUCTOS.reduce((s, p) => s + p.stock * p.costo, 0)
  const criticos = data.PRODUCTOS.filter((p) => p.stock < 10).length
  const dias30 = data.PRODUCTOS.filter((p) => {
    const rotacion = p.vendidos30d / 30
    return rotacion > 0 && p.stock / rotacion <= 7
  }).length

  const productsWithDays = data.PRODUCTOS.map((p) => {
    const rotacionDiaria = p.vendidos30d / 30
    const diasRestantes = rotacionDiaria > 0 ? Math.round(p.stock / rotacionDiaria) : 999
    return { ...p, diasRestantes, rotacionDiaria }
  }).sort((a, b) => a.diasRestantes - b.diasRestantes)

  return (
    <div className="page fade-in">
      <div className="kpi-grid">
        <MiniStat label="Valor total en stock" value={totalValor} formatter={fmtCOP} icon="package" />
        <MiniStat label="Productos críticos" value={criticos} icon="alert" danger />
        <MiniStat label="Agotan en &lt;7 días" value={dias30} icon="clock" danger={dias30 > 3} />
        <MiniStat label="Total SKUs" value={data.PRODUCTOS.length} icon="boxes" />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Estado del inventario</div>
            <div className="card-sub">Ordenado por urgencia · rotación calculada en tiempo real</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn ghost" style={{ fontSize: 11.5 }}><Icon name="download" size={12} /> Exportar</button>
            <button className="btn primary"><Icon name="plus" size={12} /> Ajuste de stock</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th style={{ textAlign: 'right' }}>Stock actual</th>
              <th style={{ textAlign: 'right' }}>Rotación/día</th>
              <th style={{ textAlign: 'right' }}>Días restantes</th>
              <th>Urgencia</th>
              <th style={{ textAlign: 'right' }}>Valor en stock</th>
              <th style={{ textAlign: 'right' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {productsWithDays.map((p) => {
              const cat = data.CATEGORIAS.find((c) => c.id === p.cat)!
              const urgent = p.diasRestantes <= 3
              const warn = p.diasRestantes <= 7
              const pct = Math.min(100, (p.diasRestantes / 30) * 100)
              const barColor = urgent ? 'var(--danger)' : warn ? 'var(--warn)' : 'var(--accent)'
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: cat.color + '22', color: cat.color, display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0 }}>{cat.icon}</div>
                      <div>
                        <div style={{ fontSize: 13 }}>{p.nombre}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.proveedor}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{cat.nombre}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', color: urgent ? 'var(--danger)' : 'var(--text)' }}>
                    {p.stock} {p.unidad}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
                    {p.rotacionDiaria.toFixed(1)}/día
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span className={`pill ${urgent ? 'danger' : warn ? 'warn' : 'ok'}`}>
                      {p.diasRestantes >= 999 ? 'Sin rotación' : `~${p.diasRestantes}d`}
                    </span>
                  </td>
                  <td style={{ minWidth: 100 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div className="bar-track" style={{ height: 5 }}>
                        <div className="bar-fill" style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-3)' }}>
                    {fmtCOP(p.stock * p.costo, { short: true })}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {warn && (
                      <button className="btn primary" style={{ fontSize: 11, padding: '5px 10px' }}>Reordenar</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
