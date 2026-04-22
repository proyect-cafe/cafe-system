import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'

export function SimplePurchasesPage() {
  const data = POS_DATA
  const totalMes = data.COMPRAS.reduce((s, c) => s + c.total, 0)
  const pendientes = data.COMPRAS.filter(c => c.estado !== 'recibido')
  const proveedores = [...new Set(data.COMPRAS.map(c => c.proveedor))]
  const topProv = proveedores.map(p => ({
    nombre: p,
    total: data.COMPRAS.filter(c => c.proveedor === p).reduce((s, c) => s + c.total, 0),
    veces: data.COMPRAS.filter(c => c.proveedor === p).length,
  })).sort((a, b) => b.total - a.total)

  return (
    <div className="page fade-in" style={{ maxWidth: 1200 }}>
      <div style={{
        padding: 28, borderRadius: 20, marginBottom: 18,
        background: 'linear-gradient(135deg, var(--surface), var(--bg-1))',
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, color: 'var(--text-3)', marginBottom: 8 }}>
          Lo que has gastado este mes
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 1 }}>
          {fmtCOP(totalMes)}
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 10, maxWidth: 600 }}>
          Comprando a <b>{proveedores.length} proveedores</b>. Te quedan <b>{pendientes.length} pedidos</b> por llegar.
        </div>
      </div>

      <div className="card" style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 4 }}>
          🚚 Pedidos en camino
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          Estos son los pedidos que todavía no te llegan
        </div>

        {pendientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-3)' }}>
            <div style={{ fontSize: 42, marginBottom: 8 }}>✓</div>
            Todo recibido
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
            {pendientes.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: 16, borderRadius: 14,
                background: c.estado === 'en_camino' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${c.estado === 'en_camino' ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'}`,
              }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                  background: c.estado === 'en_camino' ? '#3b82f6' : '#f59e0b',
                  color: '#fff', display: 'grid', placeItems: 'center', fontSize: 28,
                }}>
                  {c.estado === 'en_camino' ? '🚚' : '⏳'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{c.proveedor}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
                    {c.estado === 'en_camino' ? '🕒 Llega pronto' : '⏳ Esperando confirmación'} · {c.items} productos
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Vas a pagar</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1, marginTop: 4 }}>
                    {fmtCOP(c.total, { short: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 4 }}>
          🤝 A quiénes les compras más
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
          Tus proveedores ordenados por cuánto les compras
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="stagger">
          {topProv.slice(0, 5).map((prov, i) => (
            <div key={prov.nombre} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, borderRadius: 12, background: 'var(--bg-1)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: i === 0 ? 'var(--accent)' : 'var(--bg-3)',
                color: i === 0 ? '#000' : 'var(--text-2)',
                display: 'grid', placeItems: 'center',
                fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 18,
              }}>
                {i === 0 ? '👑' : `#${i + 1}`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{prov.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                  Le has comprado <b>{prov.veces} veces</b> este mes
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)' }}>
                {fmtCOP(prov.total, { short: true })}
              </div>
            </div>
          ))}
        </div>
        {topProv.length > 0 && (
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 12,
            background: 'var(--bg-3)', fontSize: 13, lineHeight: 1.5,
          }}>
            💡 <b>Consejo:</b> Le compras mucho a <b>{topProv[0].nombre}</b>. Negocia un descuento por volumen.
          </div>
        )}
      </div>
    </div>
  )
}
