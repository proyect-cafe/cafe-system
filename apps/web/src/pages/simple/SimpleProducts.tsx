import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'

export function SimpleProductsPage() {
  const data = POS_DATA

  const masRentables = [...data.PRODUCTOS].map(p => ({
    ...p, ganancia: (p.precio - p.costo) * p.vendidos30d,
  })).sort((a, b) => b.ganancia - a.ganancia)

  const estrellas = masRentables.slice(0, 5)
  const flojitos = [...masRentables].reverse().slice(0, 3)
  const medals = ['🥇', '🥈', '🥉', '🏅', '🏅']

  return (
    <div className="page fade-in" style={{ maxWidth: 1200 }}>
      <div style={{
        padding: 24, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        color: '#000', borderRadius: 20, marginBottom: 18,
      }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, opacity: 0.7, marginBottom: 8 }}>
          Tu catálogo
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1 }}>
          Tienes <b>{data.PRODUCTOS.length} productos</b> a la venta
        </div>
        <div style={{ fontSize: 14, opacity: 0.85, marginTop: 10, maxWidth: 600 }}>
          Distribuidos en {data.CATEGORIAS.length} categorías. Ordenados abajo por cuánta plata te dejan.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 4 }}>
          🏆 Tu Top 5 — los que más plata te dejan
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>
          Estos son los productos que DEBES mantener en stock siempre
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }} className="stagger">
          {estrellas.map((p, i) => {
            const cat = data.CATEGORIAS.find(x => x.id === p.cat)!
            const maxG = estrellas[0].ganancia
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: 16, borderRadius: 14,
                background: i === 0 ? 'var(--accent-soft)' : 'var(--bg-1)',
                border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--border)'}`,
              }}>
                <div style={{ fontSize: 36, width: 50, textAlign: 'center' }}>{medals[i]}</div>
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: cat.color + '33', color: cat.color,
                  display: 'grid', placeItems: 'center', fontSize: 26, flexShrink: 0,
                }}>{cat.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{p.nombre}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    Vendiste <b>{p.vendidos30d}</b> este mes · a <b>{fmtCOP(p.precio)}</b> cada uno
                  </div>
                  <div className="bar-track" style={{ height: 6, marginTop: 8 }}>
                    <div className="bar-fill" style={{ width: `${(p.ganancia / maxG) * 100}%` }} />
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Te dejó</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--accent)', lineHeight: 1 }}>
                    {fmtCOP(p.ganancia, { short: true })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
          😴 Productos que no se mueven
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          Estos casi no se venden. Piensa si vale la pena tenerlos o hacerles promoción.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="stagger">
          {flojitos.map(p => {
            const cat = data.CATEGORIAS.find(x => x.id === p.cat)!
            return (
              <div key={p.id} style={{
                padding: 16, borderRadius: 14, background: 'var(--bg-1)',
                border: '1px dashed var(--border)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 6, opacity: 0.4 }}>{cat.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>
                  Solo <b>{p.vendidos30d}</b> vendidos en 30 días
                </div>
                <button className="btn ghost" style={{ marginTop: 10, fontSize: 11 }}>Hacer promoción</button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 16 }}>
          📦 Tus categorías
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {data.CATEGORIAS.map(cat => {
            const prods = data.PRODUCTOS.filter(p => p.cat === cat.id)
            const ventas = prods.reduce((s, p) => s + (p.precio * p.vendidos30d), 0)
            return (
              <div key={cat.id} style={{
                padding: 18, borderRadius: 14,
                background: cat.color + '11',
                border: `1px solid ${cat.color}55`,
              }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{cat.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{cat.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 4 }}>
                  {prods.length} productos
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${cat.color}33` }}>
                  <div style={{ fontSize: 10.5, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vendió este mes</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: cat.color, lineHeight: 1, marginTop: 4 }}>
                    {fmtCOP(ventas, { short: true })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
