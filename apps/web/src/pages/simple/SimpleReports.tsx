import { CountUp } from '@/components/ui/CountUp'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'

function MoneyFlow({ label, value, color, pct, negative = false, big = false }: {
  label: string; value: number; color: string; pct: number; negative?: boolean; big?: boolean
}) {
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: big ? 15 : 14, fontWeight: big ? 500 : 400 }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: big ? 22 : 18, color }}>
          {negative ? '−' : ''}{fmtCOP(value)}
        </span>
      </div>
      <div className="bar-track" style={{ height: big ? 10 : 6 }}>
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', marginTop: 3 }}>
        {pct.toFixed(1)}% de lo que entra
      </div>
    </div>
  )
}

function PayCard({ emoji, label, pct, value, color }: { emoji: string; label: string; pct: number; value: number; color: string }) {
  return (
    <div style={{
      padding: 20, borderRadius: 14, textAlign: 'center',
      background: color + '11', border: `1px solid ${color}55`,
    }}>
      <div style={{ fontSize: 44, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, color, lineHeight: 1, margin: '8px 0' }}>
        {pct}%
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
        {fmtCOP(value, { short: true })}
      </div>
    </div>
  )
}

export function SimpleReportsPage() {
  const data = POS_DATA
  const k = data.KPIs
  const ingresos = k.ventas30d
  const cogs = k.costos30d
  const laboral = 4200000
  const operacion = 1850000
  const neto = ingresos - cogs - laboral - operacion
  const metaMes = 75000000
  const pctMeta = (ingresos / metaMes) * 100

  return (
    <div className="page fade-in" style={{ maxWidth: 1200 }}>
      <div style={{
        padding: 32, borderRadius: 20, marginBottom: 18,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        color: '#000', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, opacity: 0.7, marginBottom: 8 }}>
          Lo que GANASTE este mes
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 84, lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          <CountUp value={neto} formatter={fmtCOP} duration={1400} />
        </div>
        <div style={{ fontSize: 15, opacity: 0.85, marginTop: 14, maxWidth: 620 }}>
          Esto es lo que te queda <b>después de pagar TODO</b>: productos, empleados y gastos.
          ¡Es tu plata de verdad! <b>18.4% más</b> que el mes pasado.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 4 }}>
          🧮 Para entender tu plata
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 24 }}>
          De cada peso que entra, así se va…
        </div>

        <MoneyFlow label="💸 Vendiste en el mes" value={ingresos} color="var(--accent)" pct={100} big />
        <div style={{ paddingLeft: 20, marginTop: 4, fontSize: 12, color: 'var(--text-3)', marginBottom: 16 }}>
          Pero ojo, no es todo tuyo. De ahí sale:
        </div>

        <MoneyFlow label="📦 Lo que costaron los productos" value={cogs} color="#ef4444" pct={(cogs / ingresos) * 100} negative />
        <MoneyFlow label="👥 Sueldos del equipo" value={laboral} color="#f59e0b" pct={(laboral / ingresos) * 100} negative />
        <MoneyFlow label="🏠 Arriendo, luz, agua, etc." value={operacion} color="#8b5cf6" pct={(operacion / ingresos) * 100} negative />

        <div style={{ marginTop: 16, padding: 16, borderRadius: 14, background: 'var(--accent-soft)', border: '2px solid var(--accent)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            🎯 Lo que TE QUEDA a ti
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 6 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, color: 'var(--accent)', lineHeight: 1 }}>
              {fmtCOP(neto)}
            </div>
            <div style={{ fontSize: 16, color: 'var(--accent)', fontWeight: 600 }}>
              {((neto / ingresos) * 100).toFixed(0)}¢ de cada $1
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ fontSize: 40 }}>🎯</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>
              {pctMeta >= 100 ? '¡Meta cumplida!' : `${(100 - pctMeta).toFixed(0)}% para cumplir tu meta`}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-3)' }}>
              Quieres vender {fmtCOP(metaMes, { short: true })} en el mes — te quedan 13 días
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
            <span>Vas en <b style={{ color: 'var(--accent)' }}>{fmtCOP(ingresos, { short: true })}</b></span>
            <span style={{ color: 'var(--text-3)' }}>Meta: {fmtCOP(metaMes, { short: true })}</span>
          </div>
          <div style={{ height: 38, background: 'var(--bg-3)', borderRadius: 100, overflow: 'hidden', position: 'relative' }}>
            <div style={{
              height: '100%', width: `${Math.min(pctMeta, 100)}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
              borderRadius: 100, display: 'flex', alignItems: 'center',
              justifyContent: 'flex-end', padding: '0 14px',
              color: '#000', fontWeight: 700, fontSize: 14,
              transition: 'width 1.4s cubic-bezier(0.2,0.8,0.2,1)',
            }}>
              {pctMeta > 15 && `${pctMeta.toFixed(0)}%`}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: 14, borderRadius: 12,
          background: 'var(--accent-soft)', fontSize: 14, lineHeight: 1.5,
        }}>
          🎉 <b>¡Vas súper bien!</b> Si sigues a este ritmo, pasarás la meta con {fmtCOP(3800000, { short: true })} extra. Échale más duro los fines de semana.
        </div>
      </div>

      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
          💳 ¿Cómo te pagan los clientes?
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
          Así prefiere pagar tu gente
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <PayCard emoji="💳" label="Con tarjeta" pct={42} value={ingresos * 0.42} color="var(--accent)" />
          <PayCard emoji="💵" label="En efectivo" pct={31} value={ingresos * 0.31} color="#f59e0b" />
          <PayCard emoji="📱" label="Nequi / Daviplata" pct={27} value={ingresos * 0.27} color="#8b5cf6" />
        </div>
      </div>
    </div>
  )
}
