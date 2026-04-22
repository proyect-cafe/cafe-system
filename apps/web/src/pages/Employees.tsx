import { MiniStat } from '@/components/shared/KPI'
import { Icon } from '@/components/ui/Icon'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'
import type { Tweaks } from '@/types'
import { SimpleEmployeesPage } from './simple/SimpleEmployees'

interface Props { tweaks: Tweaks }

export function EmployeesPage({ tweaks }: Props) {
  if (tweaks.simpleMode) return <SimpleEmployeesPage />
  const data = POS_DATA
  const activos = data.EMPLEADOS.filter((e) => e.estado === 'activo').length
  const ventasHoyTotal = data.EMPLEADOS.reduce((s, e) => s + e.ventasHoy, 0)
  const hrsTotal = data.EMPLEADOS.reduce((s, e) => s + e.hrs, 0)
  const withSales = data.EMPLEADOS.filter((e) => e.transHoy > 0)
  const maxTrans = Math.max(...withSales.map((e) => e.transHoy))

  return (
    <div className="page fade-in">
      <div className="kpi-grid">
        <MiniStat label="En turno ahora" value={activos} icon="employees" />
        <MiniStat label="Ventas del equipo hoy" value={ventasHoyTotal} formatter={fmtCOP} icon="cash" />
        <MiniStat label="Horas trabajadas hoy" value={parseFloat(hrsTotal.toFixed(1))} formatter={(n) => n.toFixed(1) + 'h'} icon="clock" />
        <MiniStat label="Costo laboral (est.)" value={680000} formatter={fmtCOP} icon="card" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 20 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Personal en turno</div>
              <div className="card-sub">Actualizado en vivo</div>
            </div>
            <button className="btn primary"><Icon name="plus" size={12} /> Nuevo empleado</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
            {data.EMPLEADOS.map((e) => (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${e.color}, ${e.color}99)`, display: 'grid', placeItems: 'center', color: '#000', fontWeight: 700, fontSize: 13, position: 'relative', flexShrink: 0 }}>
                  {e.foto}
                  <span style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: e.estado === 'activo' ? 'var(--accent)' : 'var(--text-4)', border: '2px solid var(--surface)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5 }}>{e.nombre}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{e.rol} · {e.turno}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{e.hrs}h</div>
                  {e.ventasHoy > 0 && (
                    <div style={{ fontSize: 10.5, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{fmtCOP(e.ventasHoy, { short: true })}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Rendimiento del equipo · hoy</div>
              <div className="card-sub">Transacciones por cajero</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }} className="stagger">
            {withSales.map((e) => (
              <div key={e.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: e.color, color: '#000', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>{e.foto}</div>
                  <span style={{ fontSize: 13, flex: 1 }}>{e.nombre}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{e.transHoy} ventas</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', minWidth: 70, textAlign: 'right' }}>{fmtCOP(e.ventasHoy, { short: true })}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(e.transHoy / maxTrans) * 100}%`, background: e.color }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, padding: 12, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="sparkles" size={16} />
            <div style={{ fontSize: 12 }}>
              <b>Andrés</b> tiene mejor conversión (ticket +$320) — considera entrenarlo como supervisor.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
