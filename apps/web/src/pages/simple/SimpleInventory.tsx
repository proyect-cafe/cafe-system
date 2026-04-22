import { CountUp } from '@/components/ui/CountUp'
import { POS_DATA } from '@/data'

function SemaforoCard({ emoji, label, count, desc, color }: { emoji: string; label: string; count: number; desc: string; color: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: 24, borderColor: count > 0 ? color : 'var(--border)' }}>
      <div style={{ fontSize: 48, marginBottom: 6 }}>{emoji}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 54, lineHeight: 1, color: count > 0 ? color : 'var(--text-3)' }}>
        <CountUp value={count} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{desc}</div>
    </div>
  )
}

export function SimpleInventoryPage() {
  const data = POS_DATA

  const withDays = data.PRODUCTOS.map(p => ({
    ...p, dias: Math.max(1, Math.round(p.stock / (p.vendidos30d / 30))),
  }))

  const rojos = withDays.filter(p => p.dias < 3).sort((a, b) => a.dias - b.dias)
  const amarillos = withDays.filter(p => p.dias >= 3 && p.dias < 7).sort((a, b) => a.dias - b.dias)
  const verdes = withDays.filter(p => p.dias >= 7).length

  return (
    <div className="page fade-in" style={{ maxWidth: 1200 }}>
      <div style={{
        padding: 28, borderRadius: 20, marginBottom: 18,
        background: rojos.length > 0
          ? 'linear-gradient(135deg, #ef4444, #dc2626)'
          : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, opacity: 0.8, marginBottom: 8 }}>
          Estado de tu bodega · ahora
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1 }}>
          {rojos.length > 0
            ? `Se te acaban ${rojos.length} producto${rojos.length > 1 ? 's' : ''}`
            : '¡Todo bien en tu bodega!'}
        </div>
        <div style={{ fontSize: 14, opacity: 0.9, marginTop: 10 }}>
          {rojos.length > 0
            ? 'Necesitas pedir más urgente, o vas a perder ventas.'
            : 'No hay nada urgente por pedir hoy.'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 18 }}>
        <SemaforoCard emoji="🔴" label="Urgente — se acaba" count={rojos.length} desc="Pide hoy mismo" color="var(--danger)" />
        <SemaforoCard emoji="🟡" label="Para esta semana" count={amarillos.length} desc="Pide pronto" color="#f59e0b" />
        <SemaforoCard emoji="🟢" label="Sin preocupaciones" count={verdes} desc="Stock saludable" color="var(--accent)" />
      </div>

      {rojos.length > 0 && (
        <div className="card" style={{ marginBottom: 18, border: '1px solid var(--danger)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 32 }}>🚨</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}>Pide AHORA</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Se te van a acabar en menos de 3 días</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }} className="stagger">
            {rojos.map(p => {
              const cat = data.CATEGORIAS.find(x => x.id === p.cat)!
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: 14, borderRadius: 12, background: 'rgba(239,68,68,0.08)',
                }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 14, flexShrink: 0,
                    background: 'var(--danger)', color: '#fff',
                    display: 'grid', placeItems: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1 }}>{p.dias}</div>
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: -4 }}>días</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{cat.icon} {p.nombre}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
                      Quedan solo <b>{p.stock} {p.unidad}</b> · se venden {(p.vendidos30d / 30).toFixed(1)} por día
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                      Proveedor: <b>{p.proveedor}</b>
                    </div>
                  </div>
                  <button className="btn primary" style={{ padding: '12px 18px', whiteSpace: 'nowrap' }}>
                    📞 Pedir ya
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {amarillos.length > 0 && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 28 }}>📅</div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Pide esta semana</div>
              <div style={{ fontSize: 13, color: 'var(--text-3)' }}>Entre 3 y 7 días de stock</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {amarillos.slice(0, 6).map(p => {
              const cat = data.CATEGORIAS.find(x => x.id === p.cat)!
              return (
                <div key={p.id} style={{
                  padding: 14, borderRadius: 12,
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ fontSize: 26 }}>{cat.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.nombre}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      <b style={{ color: '#f59e0b' }}>{p.dias} días</b> · {p.stock} {p.unidad}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
