import { CountUp } from '@/components/ui/CountUp'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'

export function SimpleEmployeesPage() {
  const data = POS_DATA
  const sorted = [...data.EMPLEADOS].sort((a, b) => b.ventasHoy - a.ventasHoy)
  const mvp = sorted[0]
  const activos = data.EMPLEADOS.filter(e => e.estado === 'activo')
  const ventasTotal = data.EMPLEADOS.reduce((s, e) => s + e.ventasHoy, 0)
  const hrsTotal = Math.round(data.EMPLEADOS.reduce((s, e) => s + e.hrs, 0))
  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="page fade-in" style={{ maxWidth: 1200 }}>
      {/* MVP del día */}
      <div style={{
        padding: 28, borderRadius: 20, marginBottom: 18,
        background: `linear-gradient(135deg, ${mvp.color}22, transparent)`,
        border: `2px solid ${mvp.color}`,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: `linear-gradient(135deg, ${mvp.color}, ${mvp.color}cc)`,
          display: 'grid', placeItems: 'center',
          fontSize: 48, flexShrink: 0, position: 'relative',
        }}>
          {mvp.foto}
          <div style={{ position: 'absolute', top: -12, right: -12, fontSize: 40 }}>👑</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: mvp.color, marginBottom: 4 }}>
            🏆 Mejor empleado de hoy
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, lineHeight: 1 }}>
            {mvp.nombre}
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-2)', marginTop: 8 }}>
            Lleva <b>{mvp.transHoy} ventas</b> por <b style={{ color: mvp.color }}>{fmtCOP(mvp.ventasHoy, { short: true })}</b>
          </div>
        </div>
        <button className="btn primary" style={{ padding: '14px 20px' }}>
          🎉 Felicitar
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }} className="stagger">
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>👥</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 54, lineHeight: 1, color: 'var(--accent)' }}>
            <CountUp value={activos.length} />
          </div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Trabajando ahora</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>💰</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1 }}>
            {fmtCOP(ventasTotal, { short: true })}
          </div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Vendieron en total hoy</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }}>⏱️</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 54, lineHeight: 1 }}>
            <CountUp value={hrsTotal} />h
          </div>
          <div style={{ fontSize: 14, marginTop: 8 }}>Trabajadas hoy</div>
        </div>
      </div>

      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 4 }}>
          🏁 Ranking del día
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
          Quién vendió más hoy — actualizado en vivo
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
          {sorted.filter(e => e.transHoy > 0).map((e, i) => {
            const max = sorted[0].ventasHoy
            return (
              <div key={e.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: 16, borderRadius: 14,
                background: i === 0 ? `${e.color}15` : 'var(--bg-1)',
                border: `1px solid ${i === 0 ? e.color : 'var(--border)'}`,
              }}>
                <div style={{ fontSize: 32, width: 44, textAlign: 'center' }}>
                  {medals[i] ?? `#${i + 1}`}
                </div>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg, ${e.color}, ${e.color}cc)`,
                  display: 'grid', placeItems: 'center',
                  fontSize: 24,
                }}>{e.foto}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{e.nombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{e.rol}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: e.color, lineHeight: 1 }}>
                        {fmtCOP(e.ventasHoy, { short: true })}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        {e.transHoy} ventas
                      </div>
                    </div>
                  </div>
                  <div className="bar-track" style={{ height: 6 }}>
                    <div className="bar-fill" style={{ width: `${(e.ventasHoy / max) * 100}%`, background: e.color }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{
          marginTop: 18, padding: 14, borderRadius: 12,
          background: 'var(--accent-soft)', border: '1px solid var(--accent)',
          fontSize: 13, lineHeight: 1.5,
        }}>
          💡 <b>{mvp.nombre}</b> lidera el equipo hoy. Si sigues este ritmo, puedes pensarlo como supervisor — ¡lo está haciendo muy bien!
        </div>
      </div>
    </div>
  )
}
