import { CountUp } from '@/components/ui/CountUp'
import { LineChart, Donut } from '@/components/ui/Charts'
import { Icon } from '@/components/ui/Icon'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'
import type { Tweaks } from '@/types'
import { SimpleReportsPage } from './simple/SimpleReports'

interface Props { tweaks: Tweaks }

function PLRow({ label, value, pct, color, negative, bold, big }: { label: string; value: number; pct: number; color: string; negative?: boolean; bold?: boolean; big?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', fontSize: big ? 15 : 13, fontWeight: bold || big ? 500 : 400 }}>
      <span style={{ color: negative ? 'var(--text-3)' : color }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-3)', minWidth: 50, textAlign: 'right' }}>{pct.toFixed(1)}%</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: big ? 20 : 13, color, minWidth: 120, textAlign: 'right' }}>
          {negative && value < 0 ? '−' : ''}{fmtCOP(Math.abs(value))}
        </span>
      </div>
    </div>
  )
}

function PayMethodRow({ color, label, pct, value, icon }: { color: string; label: string; pct: number; value: number; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: color + '22', color, display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={14} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
          <span>{label}</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-2)' }}>{fmtCOP(value, { short: true })}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <div className="bar-track" style={{ flex: 1, height: 4 }}>
            <div className="bar-fill" style={{ width: pct + '%', background: color }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)' }}>{pct}%</span>
        </div>
      </div>
    </div>
  )
}

export function ReportsPage({ tweaks }: Props) {
  if (tweaks.simpleMode) return <SimpleReportsPage />
  const data = POS_DATA
  const k = data.KPIs
  const ingresos = k.ventas30d
  const cogs = k.costos30d
  const laboral = 4200000
  const operacion = 1850000
  const netGanancia = ingresos - cogs - laboral - operacion

  const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((d) => {
    const entradas = 2400000 + Math.random() * 800000
    const salidas = 800000 + Math.random() * 600000
    return { d, entradas, salidas, neto: entradas - salidas }
  })

  return (
    <div className="page fade-in">
      <div style={{ padding: '24px 28px', background: 'linear-gradient(135deg, var(--surface), var(--bg-1))', border: '1px solid var(--border)', borderRadius: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: 6 }}>Ganancia neta del mes</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 1, letterSpacing: '-0.03em' }}>
            <CountUp value={netGanancia} formatter={fmtCOP} duration={1200} />
          </div>
          <span className="delta up" style={{ fontSize: 13 }}>
            <Icon name="arrowUp" size={12} /> 18.4% vs mes anterior
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Estado de resultados</div>
              <div className="card-sub">Abril 2026 · parcial</div>
            </div>
          </div>
          <div className="stagger">
            <PLRow label="Ingresos brutos" value={ingresos} pct={100} color="var(--accent)" />
            <PLRow label="Costo de mercancía (COGS)" value={-cogs} pct={cogs / ingresos * 100} negative color="var(--text-3)" />
            <div style={{ paddingTop: 8, paddingBottom: 8, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginTop: 8 }}>
              <PLRow label="Utilidad bruta" value={ingresos - cogs} pct={(ingresos - cogs) / ingresos * 100} bold color="var(--text)" />
            </div>
            <PLRow label="Costo laboral" value={-laboral} pct={laboral / ingresos * 100} negative color="var(--text-3)" />
            <PLRow label="Gastos operativos" value={-operacion} pct={operacion / ingresos * 100} negative color="var(--text-3)" />
            <div style={{ paddingTop: 14, borderTop: '2px solid var(--border-strong)', marginTop: 10 }}>
              <PLRow label="Ganancia neta" value={netGanancia} pct={netGanancia / ingresos * 100} big color="var(--accent)" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Ingresos vs Costos · 30 días</div>
              <div className="card-sub">Área sombreada = ganancia</div>
            </div>
          </div>
          <LineChart data={data.VENTAS_30D} compare={data.COSTOS_30D} style={tweaks.chartStyle} width={600} height={200} />
          <div style={{ display: 'flex', gap: 20, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: 11.5 }}>
            <span><span style={{ color: 'var(--accent)' }}>━</span> Ingresos</span>
            <span><span style={{ color: 'var(--text-4)' }}>╌╌</span> Costos</span>
          </div>
        </div>
      </div>

      {/* Flujo de caja */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Flujo de caja · Proyección 7 días</div>
            <div className="card-sub">Con base en patrón histórico y pagos programados</div>
          </div>
          <span className="pill info"><Icon name="sparkles" size={10} /> Proyección</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8, marginTop: 10 }} className="stagger">
          {dias.map(({ d, entradas, salidas, neto }) => (
            <div key={d} style={{ padding: 14, borderRadius: 12, background: 'var(--bg-1)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{d}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--accent)' }}>{fmtCOP(neto, { short: true })}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                <span>+{fmtCOP(entradas, { short: true })}</span>
                <span>-{fmtCOP(salidas, { short: true })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Distribución de métodos de pago</div>
              <div className="card-sub">Mes en curso</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <Donut
              segments={[{ value: 42, color: 'var(--accent)' }, { value: 31, color: '#f59e0b' }, { value: 27, color: '#8b5cf6' }]}
              size={140} thickness={18}
              centerLabel="Total" centerValue={fmtCOP(ingresos, { short: true })}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <PayMethodRow color="var(--accent)" label="Tarjeta" pct={42} value={ingresos * 0.42} icon="card" />
              <PayMethodRow color="#f59e0b" label="Efectivo" pct={31} value={ingresos * 0.31} icon="cash" />
              <PayMethodRow color="#8b5cf6" label="Nequi" pct={27} value={ingresos * 0.27} icon="mobile" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Objetivo del mes</div>
              <div className="card-sub">Meta: $75M · faltan 13 días</div>
            </div>
          </div>
          <div style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, letterSpacing: '-0.02em' }}>
                <CountUp value={ingresos} formatter={(n) => fmtCOP(n, { short: true })} />
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>de <span style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)' }}>$75.0M</span></span>
            </div>
            <div className="bar-track" style={{ height: 12 }}>
              <div className="bar-fill" style={{ width: `${(ingresos / 75_000_000) * 100}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-2))' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
              <span>{((ingresos / 75_000_000) * 100).toFixed(1)}% completado</span>
              <span>Proyección: ${(ingresos * 1.65 / 1_000_000).toFixed(1)}M</span>
            </div>
          </div>
          <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: 'var(--accent-soft)', border: '1px solid var(--accent)', fontSize: 12, lineHeight: 1.5 }}>
            <strong>Vas por buen camino.</strong> A tu ritmo actual, superarás la meta en $3.8M. Considera aumentar inventario para el fin de semana.
          </div>
        </div>
      </div>
    </div>
  )
}
