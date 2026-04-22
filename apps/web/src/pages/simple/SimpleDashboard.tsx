import { useMemo } from 'react'
import { CountUp } from '@/components/ui/CountUp'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'
import type { Tweaks } from '@/types'

interface Props { tweaks: Tweaks }

function ComparisonCard({ label, value, prev }: { label: string; value: number; prev: number }) {
  const diff = value - prev
  const pct = prev > 0 ? (diff / prev * 100) : 0
  const up = diff >= 0
  return (
    <div style={{ padding: '14px 16px', borderRadius: 14, background: 'var(--bg-1)', border: '1px solid var(--border)', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{up ? '⬆️' : '⬇️'}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: up ? 'var(--accent)' : 'var(--danger)', lineHeight: 1 }}>
        {up ? '+' : ''}{pct.toFixed(0)}%
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>
        {up ? 'Mejor que ' : 'Menos que '}{label.toLowerCase()}
      </div>
    </div>
  )
}

export function SimpleDashboardPage({ tweaks: _tweaks }: Props) {
  const data = POS_DATA
  const k = data.KPIs

  const metaDiaria = 2500000
  const pctMeta = Math.min(100, (k.gananciaHoy / metaDiaria) * 100)

  const avg30 = data.VENTAS_30D.reduce((a, b) => a + b, 0) / data.VENTAS_30D.length
  const streak = useMemo(() => {
    let s = 0
    for (let i = data.VENTAS_30D.length - 1; i >= 0; i--) {
      if (data.VENTAS_30D[i] >= avg30) s++
      else break
    }
    return s
  }, [data.VENTAS_30D, avg30])

  const nivel = streak >= 7 ? 'Legendario' : streak >= 5 ? 'Experto' : streak >= 3 ? 'En racha' : streak >= 1 ? 'Activo' : 'Iniciando'
  const xpPct = Math.min(100, (streak / 7) * 100)

  const topProducts = useMemo(() =>
    [...data.PRODUCTOS]
      .map(p => ({ ...p, ganancia: (p.precio - p.costo) * p.vendidos30d }))
      .sort((a, b) => b.ganancia - a.ganancia)
      .slice(0, 3),
  [data.PRODUCTOS])

  const alertas = data.PRODUCTOS
    .filter(p => p.stock < 20)
    .map(p => ({ ...p, dias: Math.max(1, Math.round(p.stock / (p.vendidos30d / 30))) }))
    .sort((a, b) => a.dias - b.dias)
    .slice(0, 3)

  const mvp = [...data.EMPLEADOS].sort((a, b) => b.ventasHoy - a.ventasHoy)[0]

  const semana = data.VENTAS_30D.slice(-7)
  const maxSem = Math.max(...semana)
  const diasLabel = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

  const ventasHoy = data.VENTAS_30D[data.VENTAS_30D.length - 1]
  const ventasAyer = data.VENTAS_30D[data.VENTAS_30D.length - 2]
  const ventasSemana = data.VENTAS_30D.slice(-7).reduce((a, b) => a + b, 0)
  const ventasSemanaAnterior = data.VENTAS_30D.slice(-14, -7).reduce((a, b) => a + b, 0)
  const mejorDia = Math.max(...data.VENTAS_30D)

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="page fade-in">
      {/* Hero */}
      <div style={{
        padding: '28px 32px', borderRadius: 20, marginBottom: 18,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        color: '#000', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, opacity: 0.7, marginBottom: 8 }}>
          Tu negocio hoy
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 1, marginBottom: 6 }}>
          <CountUp value={k.gananciaHoy} formatter={(n) => fmtCOP(n)} duration={1200} />
        </div>
        <div style={{ fontSize: 15, opacity: 0.85, marginBottom: 20 }}>
          {pctMeta >= 100
            ? '¡Meta del día cumplida! Eres un crack. 🎉'
            : `Has ganado en limpio hoy. Faltan ${fmtCOP(metaDiaria - k.gananciaHoy)} para tu meta.`}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, opacity: 0.8 }}>
            <span>Meta del día: {fmtCOP(metaDiaria, { short: true })}</span>
            <span><b>{pctMeta.toFixed(0)}%</b> completado</span>
          </div>
          <div style={{ height: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 100, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pctMeta}%`,
              background: 'rgba(0,0,0,0.4)', borderRadius: 100,
              transition: 'width 1.4s cubic-bezier(0.2,0.8,0.2,1)',
            }} />
          </div>
        </div>
      </div>

      {/* 3 status cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }} className="stagger">
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, color: 'var(--accent)' }}>
            <CountUp value={k.gananciaHoy} formatter={(n) => fmtCOP(n, { short: true })} duration={1000} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8 }}>Ganancia limpia</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4, lineHeight: 1.4 }}>
            Lo que te queda después de pagar los productos
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔥</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1, color: '#f59e0b' }}>
            {streak} días
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8 }}>Racha activa</div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 6, borderRadius: 100,
                background: i < streak ? '#f59e0b' : 'var(--bg-3)',
                transition: `background 0.3s ease ${i * 0.08}s`,
              }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
            Días seguidos por encima del promedio
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⭐</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, lineHeight: 1 }}>{nivel}</div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 8 }}>Nivel del negocio</div>
          <div style={{ height: 8, background: 'var(--bg-3)', borderRadius: 100, overflow: 'hidden', marginTop: 10 }}>
            <div style={{
              height: '100%', width: `${xpPct}%`,
              background: 'linear-gradient(90deg, var(--accent), var(--accent-2))',
              borderRadius: 100,
              transition: 'width 1.4s cubic-bezier(0.2,0.8,0.2,1)',
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
            {streak < 7 ? `${7 - streak} días más para subir` : '¡Nivel máximo!'}
          </div>
        </div>
      </div>

      {/* Comparisons */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>📊 ¿Cómo vas?</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          Comparado con antes — en ventas
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          <ComparisonCard label="Ayer" value={ventasHoy} prev={ventasAyer} />
          <ComparisonCard label="Semana pasada" value={ventasSemana} prev={ventasSemanaAnterior} />
          <ComparisonCard label="Mejor día" value={ventasHoy} prev={mejorDia} />
        </div>
      </div>

      {/* Top products + Alertas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
            🏆 Productos ganadores
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
            Los que más plata te dejan este mes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }} className="stagger">
            {topProducts.map((p, i) => {
              const cat = data.CATEGORIAS.find(c => c.id === p.cat)!
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 30 }}>{medals[i]}</div>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: cat.color + '22', color: cat.color, display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      Nunca te quedes sin {p.nombre.split(' ')[0]}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Te dejó</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)', lineHeight: 1, marginTop: 2 }}>
                      {fmtCOP(p.ganancia, { short: true })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card" style={{ border: alertas.length > 0 ? '1px solid var(--warn)' : undefined }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
            ⚠️ Atención hoy
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            Productos que se te van a acabar pronto
          </div>
          {alertas.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-3)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <div>¡Todo el stock está bien!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
              {alertas.map(p => {
                const cat = data.CATEGORIAS.find(c => c.id === p.cat)!
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                      background: p.dias <= 2 ? 'var(--danger)' : '#f59e0b',
                      color: '#fff', display: 'grid', placeItems: 'center',
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, lineHeight: 1 }}>{p.dias}</div>
                      <div style={{ fontSize: 9, opacity: 0.85 }}>días</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{cat.icon} {p.nombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        Quedan solo {p.stock} {p.unidad}
                      </div>
                    </div>
                    <button className="btn primary" style={{ fontSize: 11, padding: '6px 12px', whiteSpace: 'nowrap' }}>Pedir</button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Empleado del día + Semana visual */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 14 }}>
        <div className="card" style={{ border: `2px solid ${mvp.color}` }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 14 }}>
            👑 Empleado del día
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '4px 0 12px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: `linear-gradient(135deg, ${mvp.color}, ${mvp.color}cc)`,
              display: 'grid', placeItems: 'center', fontSize: 40, marginBottom: 12,
            }}>{mvp.foto}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, lineHeight: 1 }}>{mvp.nombre}</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>{mvp.rol}</div>
            <div style={{ marginTop: 10, padding: '6px 14px', borderRadius: 100, background: mvp.color + '22', color: mvp.color, fontSize: 13, fontWeight: 500 }}>
              {fmtCOP(mvp.ventasHoy, { short: true })} en ventas
            </div>
            <button className="btn primary" style={{ marginTop: 14, width: '100%' }}>
              🎉 Felicitar
            </button>
          </div>
        </div>

        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
            📅 Tu semana
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
            Los últimos 7 días — la barra más alta es tu mejor día
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 110 }}>
            {semana.map((v, i) => {
              const h = (v / maxSem) * 100
              const isBest = v === maxSem
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%' }}>
                  {isBest && <span style={{ fontSize: 13 }}>⭐</span>}
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', minHeight: 4,
                      height: `${h}%`,
                      background: isBest ? 'linear-gradient(180deg, var(--accent), var(--accent-2))' : 'var(--border-strong)',
                      borderRadius: '4px 4px 0 0',
                      transition: `height 0.8s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.06}s`,
                    }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{diasLabel[i]}</div>
                </div>
              )
            })}
          </div>
          <div style={{
            marginTop: 14, padding: 12, borderRadius: 12,
            background: 'var(--accent-soft)', border: '1px solid var(--accent)',
            fontSize: 13, lineHeight: 1.5,
          }}>
            💡 Tu mejor día es el <b>{diasLabel[semana.indexOf(maxSem)]}</b>. ¡Asegúrate de tener todo el stock listo para ese día!
          </div>
        </div>
      </div>
    </div>
  )
}
