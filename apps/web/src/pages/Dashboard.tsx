import { useMemo, useState } from 'react'
import { KPI } from '@/components/shared/KPI'
import { CountUp } from '@/components/ui/CountUp'
import { LineChart, BarChart, Donut } from '@/components/ui/Charts'
import { Icon } from '@/components/ui/Icon'
import { POS_DATA } from '@/data'
import { fmtCOP, fmtNum } from '@/lib/formatters'
import type { Tweaks } from '@/types'
import { SimpleDashboardPage } from './simple/SimpleDashboard'

type BarDatum = Record<string, number | string>

interface Props { tweaks: Tweaks }

function InsightStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>{sub}</div>
    </div>
  )
}

function Recommendation({ accent, title, body, action }: { accent: string; title: string; body: string; action: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '12px 4px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 3, borderRadius: 3, background: accent, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.45 }}>{body}</div>
      </div>
      <button className="btn ghost" style={{ fontSize: 11, padding: '4px 10px', height: 'fit-content', marginTop: 4 }}>
        {action} <Icon name="arrowRight" size={10} />
      </button>
    </div>
  )
}

export function DashboardPage({ tweaks }: Props) {
  if (tweaks.simpleMode) return <SimpleDashboardPage tweaks={tweaks} />
  const data = POS_DATA
  const k = data.KPIs
  const [period, setPeriod] = useState<'hoy' | '15d' | '30d'>('hoy')
  const [compareOn, setCompareOn] = useState(true)

  const series = useMemo(() => {
    if (period === 'hoy') return data.VENTAS_HORA.map((x) => x.v)
    if (period === '15d') return data.VENTAS_30D.slice(-15)
    return data.VENTAS_30D
  }, [period, data])

  const compareSeries = compareOn ? series.map((v) => v * (0.78 + Math.random() * 0.2)) : undefined
  const totalPeriodo = series.reduce((a, b) => a + b, 0)
  const prevTotal = compareSeries ? compareSeries.reduce((a, b) => a + b, 0) : totalPeriodo * 0.82
  const deltaPct = ((totalPeriodo - prevTotal) / prevTotal * 100).toFixed(1)

  const ranked = [...data.PRODUCTOS].sort((a, b) => b.vendidos30d - a.vendidos30d)
  const estrellas = ranked.slice(0, 5)
  const zombies = data.PRODUCTOS.filter((p) => p.vendidos30d < 100).sort((a, b) => a.vendidos30d - b.vendidos30d).slice(0, 4)

  const marginByCat = data.CATEGORIAS.map((c) => {
    const prods = data.PRODUCTOS.filter((p) => p.cat === c.id)
    const ingresos = prods.reduce((s, p) => s + p.precio * p.vendidos30d, 0)
    const costos = prods.reduce((s, p) => s + p.costo * p.vendidos30d, 0)
    const margen = ((ingresos - costos) / ingresos * 100)
    return { ...c, ingresos, ganancia: ingresos - costos, margen }
  }).sort((a, b) => b.ganancia - a.ganancia)

  const alertas = data.PRODUCTOS.filter((p) => p.stock < 20).sort((a, b) => a.stock - b.stock)

  const heroValue = period === 'hoy' ? k.gananciaHoy : period === '15d' ? k.ganancia15d : k.ganancia30d
  const ventasHoraData: BarDatum[] = data.VENTAS_HORA.map((x) => ({ h: x.h, v: x.v }))

  return (
    <div className="page fade-in">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg-1) 100%)',
        border: '1px solid var(--border)', borderRadius: 20, padding: '28px 32px',
        marginBottom: 20, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -80, width: 400, height: 400, background: 'radial-gradient(circle, var(--accent-soft), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="dot-ind" style={{ color: 'var(--accent)' }} />
              <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-3)', fontWeight: 500 }}>
                En vivo · Ganancia {period === 'hoy' ? 'de hoy' : period === '15d' ? 'quincenal' : 'mensual'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, lineHeight: 1, letterSpacing: '-0.03em' }}>
              <CountUp value={heroValue} formatter={(n) => fmtCOP(n)} duration={1200} />
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 18, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ingresos</div>
                <div className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginTop: 2 }}>
                  <CountUp value={totalPeriodo} formatter={(n) => fmtCOP(n)} />
                </div>
              </div>
              <div style={{ height: 30, width: 1, background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Margen</div>
                <div className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 16, marginTop: 2 }}>
                  <CountUp value={56.2} formatter={(n) => n.toFixed(1) + '%'} />
                </div>
              </div>
              <div style={{ height: 30, width: 1, background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>vs anterior</div>
                <span className={`delta ${parseFloat(deltaPct) >= 0 ? 'up' : 'down'}`} style={{ marginTop: 4, display: 'inline-flex' }}>
                  <Icon name={parseFloat(deltaPct) >= 0 ? 'arrowUp' : 'arrowDown'} size={11} />
                  {Math.abs(parseFloat(deltaPct))}%
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div className="seg" style={{ background: 'var(--bg-2)', border: '1px solid var(--border)' }}>
              {(['hoy', '15d', '30d'] as const).map((p) => (
                <button key={p} className={period === p ? 'on' : ''} onClick={() => setPeriod(p)}>
                  {p === 'hoy' ? 'Hoy' : p === '15d' ? 'Quincena' : 'Mes'}
                </button>
              ))}
            </div>
            <button className="btn ghost" onClick={() => setCompareOn((v) => !v)} style={{ fontSize: 11.5 }}>
              <Icon name="calendar" size={12} />
              {compareOn ? 'Ocultar comparación' : 'Comparar período'}
            </button>
          </div>
        </div>
        <div style={{ marginTop: 20, marginLeft: -12, marginRight: -12 }}>
          {period === 'hoy'
            ? <BarChart data={ventasHoraData} width={900} height={180} />
            : <LineChart data={series} compare={compareSeries} style={tweaks.chartStyle} width={900} height={180} showDots={series.length <= 15} />
          }
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid stagger">
        <KPI label="Transacciones hoy" value={k.transHoy} delta="+12.4%" trend="up" sparkData={[120, 135, 128, 148, 155, 160, 172]} />
        <KPI label="Ticket promedio" value={k.ticketPromedio} formatter={(n) => fmtCOP(n)} delta="+4.8%" trend="up" sparkData={[18200, 18800, 19100, 19400, 19600, 20100, 20240]} />
        <KPI label="Productos vendidos" value={1284} delta="+18.2%" trend="up" sparkData={[980, 1040, 1120, 1180, 1210, 1250, 1284]} />
        <KPI label="Clientes nuevos" value={42} delta="-3.1%" trend="down" sparkData={[48, 51, 46, 44, 43, 41, 42]} />
      </div>

      {/* Ventas + Margen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Horario pico de ventas</div>
              <div className="card-sub">Las mejores horas para staff adicional</div>
            </div>
            <span className="pill info"><Icon name="sparkles" size={10} /> Insight</span>
          </div>
          <BarChart data={ventasHoraData} width={700} height={170} />
          <div style={{ display: 'flex', gap: 24, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <InsightStat label="Pico hoy" value="13:00" sub={fmtCOP(1120000, { short: true }) + ' en ventas'} />
            <InsightStat label="Pico semanal" value="Viernes" sub="+34% vs promedio" />
            <InsightStat label="Hora valle" value="10:00" sub="Considera promos" />
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Margen por categoría</div>
              <div className="card-sub">Últimos 30 días</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <Donut
              segments={marginByCat.slice(0, 6).map((c) => ({ value: c.ganancia, color: c.color }))}
              size={140} thickness={18}
              centerLabel="Ganancia"
              centerValue={fmtCOP(marginByCat.reduce((s, c) => s + c.ganancia, 0), { short: true })}
            />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {marginByCat.slice(0, 5).map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                  <span style={{ flex: 1, color: 'var(--text-2)' }}>{c.nombre}</span>
                  <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{c.margen.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stars & Zombies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'grid', placeItems: 'center' }}>
                <Icon name="flame" size={16} />
              </div>
              <div>
                <div className="card-title">Productos estrella</div>
                <div className="card-sub">Los 5 con mayor rotación este mes</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
            {estrellas.map((p, i) => {
              const cat = data.CATEGORIAS.find((c) => c.id === p.cat)!
              const max = estrellas[0].vendidos30d
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)', textAlign: 'right' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nombre}</span>
                      <span className="tabular" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-2)' }}>{fmtNum(p.vendidos30d)} u.</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${(p.vendidos30d / max) * 100}%`, background: cat.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(239,68,68,0.14)', color: 'var(--danger)', display: 'grid', placeItems: 'center' }}>
                <Icon name="zombie" size={16} />
              </div>
              <div>
                <div className="card-title">Productos zombie</div>
                <div className="card-sub">Baja rotación — considera descuento o retirar</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
            {zombies.map((p) => {
              const cat = data.CATEGORIAS.find((c) => c.id === p.cat)!
              const capitalInmovilizado = p.stock * p.costo
              return (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: cat.color + '22', color: cat.color, display: 'grid', placeItems: 'center', fontSize: 14, flexShrink: 0 }}>
                    {cat.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, marginBottom: 2 }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {p.vendidos30d} vendidos · {fmtCOP(capitalInmovilizado, { short: true })} inmovilizado
                    </div>
                  </div>
                  <button className="btn ghost" style={{ fontSize: 11, padding: '5px 10px' }}>Descuento</button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Alertas + Recomendaciones */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 14 }}>
        <div className="card">
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(245,158,11,0.14)', color: 'var(--warn)', display: 'grid', placeItems: 'center' }}>
                <Icon name="alert" size={16} />
              </div>
              <div>
                <div className="card-title">Alertas de reorden inteligente</div>
                <div className="card-sub">Basado en rotación + tiempo de entrega</div>
              </div>
            </div>
            <button className="btn ghost" style={{ fontSize: 11.5 }}>Ver todas</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{ textAlign: 'right' }}>Stock</th>
                <th style={{ textAlign: 'right' }}>Días</th>
                <th style={{ textAlign: 'right' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {alertas.slice(0, 5).map((p) => {
                const dias = Math.max(1, Math.round(p.stock / (p.vendidos30d / 30)))
                const urgent = dias <= 2
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontSize: 13 }}>{p.nombre}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{p.proveedor}</div>
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{p.stock} {p.unidad}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`pill ${urgent ? 'danger' : 'warn'}`}>~{dias}d</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn primary" style={{ fontSize: 11, padding: '5px 10px' }}>Reordenar</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(6,182,212,0.14)', color: 'var(--info)', display: 'grid', placeItems: 'center' }}>
                <Icon name="sparkles" size={16} />
              </div>
              <div>
                <div className="card-title">Recomendaciones para crecer</div>
                <div className="card-sub">Generadas de tus datos de ventas</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
            <Recommendation accent="var(--accent)" title="Sube precio del Pandebono +8%" body="Se vende 4x más que el promedio. Impacto estimado: +$1.85M mensuales sin afectar volumen." action="Aplicar" />
            <Recommendation accent="var(--warn)" title="Combo Café + Croissant de $9.900" body="62% de los que piden café también compran panadería. Ticket promedio subiría ~$1.400." action="Crear combo" />
            <Recommendation accent="var(--info)" title="Happy hour 15:00–17:00" body="Tu hora valle pierde $480k/día. -15% en bebidas atraería estudiantes de la zona." action="Programar" />
            <Recommendation accent="var(--danger)" title="Descontinuar Mantequilla Colanta" body="Rotación bajó 34% en 60 días. $158k inmovilizados. Reemplazar por versión premium." action="Analizar" />
          </div>
        </div>
      </div>

      {/* Transacciones */}
      <div className="card" style={{ marginTop: 14 }}>
        <div className="card-head">
          <div>
            <div className="card-title">Transacciones recientes</div>
            <div className="card-sub">En vivo · Últimos 30 minutos</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="pill ok"><span className="dot-ind" /> Activo</span>
            <button className="btn ghost" style={{ fontSize: 11.5 }}><Icon name="download" size={12} /> Exportar</button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Hora</th><th>Items</th><th>Método</th><th>Cajero</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.TRANSACCIONES.map((t) => (
              <tr key={t.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{t.id}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-2)' }}>{t.hora}</td>
                <td>{t.items}</td>
                <td>
                  <span className="pill">
                    <Icon name={t.metodo === 'Efectivo' ? 'cash' : t.metodo === 'Nequi' ? 'mobile' : 'card'} size={10} />
                    {t.metodo}
                  </span>
                </td>
                <td style={{ color: 'var(--text-2)' }}>{t.cajero}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtCOP(t.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
