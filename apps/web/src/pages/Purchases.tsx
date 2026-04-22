import { MiniStat } from '@/components/shared/KPI'
import { Icon } from '@/components/ui/Icon'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'
import type { Tweaks } from '@/types'
import { SimplePurchasesPage } from './simple/SimplePurchases'

interface Props { tweaks: Tweaks }

export function PurchasesPage({ tweaks }: Props) {
  if (tweaks.simpleMode) return <SimplePurchasesPage />
  const data = POS_DATA

  const totalMes = data.COMPRAS.reduce((s, c) => s + c.total, 0)
  const pendientes = data.COMPRAS.filter((c) => c.estado === 'pendiente').length
  const proveedores = new Set(data.COMPRAS.map((c) => c.proveedor)).size

  const proveedorTotals = Array.from(new Set(data.COMPRAS.map((c) => c.proveedor))).map((prov) => {
    const total = data.COMPRAS.filter((c) => c.proveedor === prov).reduce((s, c) => s + c.total, 0)
    return { prov, total }
  }).sort((a, b) => b.total - a.total)
  const maxTotal = proveedorTotals[0]?.total ?? 1

  return (
    <div className="page fade-in">
      <div className="kpi-grid">
        <MiniStat label="Total compras este mes" value={totalMes} formatter={fmtCOP} icon="purchases" />
        <MiniStat label="Órdenes pendientes" value={pendientes} icon="clock" danger={pendientes > 0} />
        <MiniStat label="Proveedores activos" value={proveedores} icon="truck" />
        <MiniStat label="Ahorro vs mes anterior" value={12.4} formatter={(n) => n.toFixed(1) + '%'} icon="trendDown" accent />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginTop: 20 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Órdenes de compra</div>
              <div className="card-sub">Últimos 7 días</div>
            </div>
            <button className="btn primary"><Icon name="plus" size={12} /> Nueva orden</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Fecha</th>
                <th>Items</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.COMPRAS.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                        {c.proveedor.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 13 }}>{c.proveedor}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{c.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{c.fecha}</td>
                  <td style={{ fontFamily: 'var(--font-mono)' }}>{c.items}</td>
                  <td>
                    <span className={`pill ${c.estado === 'recibido' ? 'ok' : c.estado === 'en_camino' ? 'info' : 'warn'}`}>
                      <span className="dot-ind" />
                      {c.estado.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmtCOP(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Top proveedores</div>
              <div className="card-sub">Por volumen de compra</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="stagger">
            {proveedorTotals.map(({ prov, total }) => (
              <div key={prov}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span>{prov}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{fmtCOP(total, { short: true })}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(total / maxTotal) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
