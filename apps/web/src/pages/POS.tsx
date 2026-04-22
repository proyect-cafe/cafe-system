import { useMemo, useState } from 'react'
import { CountUp } from '@/components/ui/CountUp'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/components/ui/Toast'
import { POS_DATA } from '@/data'
import { fmtCOP } from '@/lib/formatters'
import type { Producto, Categoria } from '@/types'

interface CartItem extends Producto { qty: number }

function CatChip({ active, onClick, label, count, color, icon }: { active: boolean; onClick: () => void; label: string; count: number; color: string; icon?: string }) {
  return (
    <button onClick={onClick} style={{
      padding: '8px 14px', borderRadius: 100,
      background: active ? 'var(--text)' : 'var(--surface)',
      color: active ? 'var(--bg)' : 'var(--text-2)',
      border: `1px solid ${active ? 'var(--text)' : 'var(--border)'}`,
      display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5,
      whiteSpace: 'nowrap', fontWeight: 500, transition: 'all 0.2s',
    }}>
      {icon && <span style={{ color: active ? 'var(--bg)' : color, fontSize: 10 }}>{icon}</span>}
      {label}
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: active ? 'rgba(0,0,0,0.14)' : 'var(--bg-3)', padding: '1px 6px', borderRadius: 100 }}>{count}</span>
    </button>
  )
}

function ProductTile({ product, cat, onAdd }: { product: Producto; cat: Categoria; onAdd: () => void }) {
  const [clicked, setClicked] = useState(false)
  const handle = () => {
    onAdd()
    setClicked(true)
    setTimeout(() => setClicked(false), 300)
  }
  const low = product.stock < 15
  return (
    <button onClick={handle} style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 12,
      textAlign: 'left', transition: 'all 0.18s cubic-bezier(0.2,0.8,0.2,1)',
      transform: clicked ? 'scale(0.96)' : 'scale(1)', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = clicked ? 'scale(0.96)' : 'none' }}
    >
      <div style={{ aspectRatio: '1.3', borderRadius: 10, background: `linear-gradient(135deg, ${cat.color}22, ${cat.color}08)`, display: 'grid', placeItems: 'center', color: cat.color, fontFamily: 'var(--font-display)', fontSize: 42, position: 'relative' }}>
        {cat.icon}
        {low && <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, padding: '2px 6px', borderRadius: 100, background: 'rgba(245,158,11,0.9)', color: '#000', fontWeight: 600 }}>{product.stock} {product.unidad}</span>}
      </div>
      <div>
        <div style={{ fontSize: 12.5, lineHeight: 1.3, marginBottom: 4, minHeight: 32 }}>{product.nombre}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{fmtCOP(product.precio)}</span>
          <span style={{ fontSize: 10, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cat.nombre}</span>
        </div>
      </div>
    </button>
  )
}

function CartItemRow({ item, cat, onInc, onDec, onRemove }: { item: CartItem; cat: Categoria; onInc: () => void; onDec: () => void; onRemove: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, transition: 'background 0.15s' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-1)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: 36, height: 36, borderRadius: 8, background: cat.color + '22', color: cat.color, display: 'grid', placeItems: 'center', flexShrink: 0, fontSize: 16 }}>{cat.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.nombre}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{fmtCOP(item.precio)} c/u</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--bg-3)', borderRadius: 8, padding: 2 }}>
        <button onClick={onDec} style={{ width: 24, height: 24, borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}><Icon name="minus" size={12} /></button>
        <span style={{ minWidth: 20, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{item.qty}</span>
        <button onClick={onInc} style={{ width: 24, height: 24, borderRadius: 6, display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}><Icon name="plus" size={12} /></button>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, minWidth: 70, textAlign: 'right' }}>{fmtCOP(item.precio * item.qty)}</div>
    </div>
  )
}

export function POSPage() {
  const data = POS_DATA
  const toast = useToast()
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showPayModal, setShowPayModal] = useState(false)
  const [payMethod, setPayMethod] = useState<string | null>(null)
  const [recibido, setRecibido] = useState(0)
  const [processing, setProcessing] = useState(false)

  const filteredProducts = useMemo(() => {
    return data.PRODUCTOS.filter((p) => {
      if (activeCat !== 'all' && p.cat !== activeCat) return false
      if (search && !p.nombre.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [activeCat, search, data.PRODUCTOS])

  const addToCart = (p: Producto) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === p.id)
      if (existing) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...p, qty: 1 }]
    })
  }

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter((i) => i.qty > 0))
  }

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))

  const subtotal = cart.reduce((s, i) => s + i.precio * i.qty, 0)
  const iva = Math.round(subtotal * 0.08)
  const total = subtotal + iva
  const cambio = Math.max(0, recibido - total)

  const cobrar = () => {
    if (cart.length === 0) return toast('Agrega productos al carrito', { color: 'var(--warn)' })
    setShowPayModal(true)
    setPayMethod(null)
    setRecibido(total)
  }

  const completarPago = () => {
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setShowPayModal(false)
      toast(`Venta por ${fmtCOP(total)} registrada ✓`)
      setCart([])
      setPayMethod(null)
      setRecibido(0)
    }, 1400)
  }

  const cat = (id: string) => data.CATEGORIAS.find((c) => c.id === id)!

  return (
    <div className="page" style={{ paddingBottom: 20 }}>
      <div className="pos-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 16, height: 'calc(100vh - 100px)', minHeight: 520 }}>
        {/* Catálogo */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
            <CatChip active={activeCat === 'all'} onClick={() => setActiveCat('all')} label="Todo" count={data.PRODUCTOS.length} color="var(--text)" />
            {data.CATEGORIAS.map((c) => (
              <CatChip key={c.id} active={activeCat === c.id} onClick={() => setActiveCat(c.id)} label={c.nombre} count={data.PRODUCTOS.filter((p) => p.cat === c.id).length} color={c.color} icon={c.icon} />
            ))}
          </div>
          <div className="search-box" style={{ width: '100%', marginBottom: 12 }}>
            <span style={{ color: 'var(--text-3)' }}><Icon name="search" size={14} /></span>
            <input placeholder="Buscar producto o escanear código…" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
            <span className="kbd">Enter</span>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, marginRight: -4 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }} className="stagger">
              {filteredProducts.map((p) => (
                <ProductTile key={p.id} product={p} cat={cat(p.cat)} onAdd={() => addToCart(p)} />
              ))}
              {filteredProducts.length === 0 && (
                <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>Sin resultados para "{search}"</div>
              )}
            </div>
          </div>
        </div>

        {/* Carrito */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>Orden #{String(8430 + cart.length).padStart(4, '0')}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Mesa 4 · Camila R.</div>
            </div>
            {cart.length > 0 && (
              <button className="icon-btn" style={{ width: 30, height: 30 }} onClick={() => setCart([])} title="Limpiar">
                <Icon name="trash" size={13} />
              </button>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
            {cart.length === 0 && (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-3)' }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: 'var(--bg-3)', display: 'grid', placeItems: 'center', margin: '0 auto 14px', color: 'var(--text-4)' }}>
                  <Icon name="pos" size={28} />
                </div>
                <div style={{ fontSize: 13 }}>Carrito vacío</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>Selecciona productos para comenzar</div>
              </div>
            )}
            {cart.map((item) => (
              <CartItemRow key={item.id} item={item} cat={cat(item.cat)} onInc={() => updateQty(item.id, 1)} onDec={() => updateQty(item.id, -1)} onRemove={() => removeItem(item.id)} />
            ))}
          </div>

          {cart.length > 0 && (
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-1)' }}>
              <SumLine label="Subtotal" value={subtotal} />
              <SumLine label="IVA (8%)" value={iva} muted />
              <div style={{ height: 1, background: 'var(--border)', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '-0.02em' }}>
                  <CountUp value={total} formatter={fmtCOP} duration={400} />
                </span>
              </div>
              <button className="btn primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 14, marginTop: 14 }} onClick={cobrar}>
                Cobrar · {fmtCOP(total)} <Icon name="arrowRight" size={14} />
              </button>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button className="btn" style={{ flex: 1, fontSize: 11.5, justifyContent: 'center' }}>Nota</button>
                <button className="btn" style={{ flex: 1, fontSize: 11.5, justifyContent: 'center' }}>Descuento</button>
                <button className="btn" style={{ flex: 1, fontSize: 11.5, justifyContent: 'center' }}>Dividir</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de pago */}
      {showPayModal && (
        <div className="modal-backdrop" onClick={() => !processing && setShowPayModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            {!processing ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total a cobrar</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 1, marginTop: 8, letterSpacing: '-0.03em' }}>{fmtCOP(total)}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                  {['Efectivo', 'Tarjeta', 'Nequi'].map((m) => (
                    <button key={m} onClick={() => setPayMethod(m)} style={{
                      padding: '16px 10px', borderRadius: 12,
                      background: payMethod === m ? 'var(--accent-soft)' : 'var(--bg-3)',
                      border: `1px solid ${payMethod === m ? 'var(--accent)' : 'var(--border)'}`,
                      color: payMethod === m ? 'var(--accent)' : 'var(--text)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s',
                    }}>
                      <Icon name={m === 'Efectivo' ? 'cash' : m === 'Tarjeta' ? 'card' : 'mobile'} size={22} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{m}</span>
                    </button>
                  ))}
                </div>
                {payMethod === 'Efectivo' && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Recibido</div>
                    <input type="number" value={recibido} onChange={(e) => setRecibido(Number(e.target.value))} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', padding: '12px 14px', fontSize: 20, fontFamily: 'var(--font-mono)', borderRadius: 10, width: '100%', color: 'var(--text)' }} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                      {[total, 50000, 100000, 200000].map((q) => (
                        <button key={q} className="btn" style={{ flex: 1, fontSize: 11, justifyContent: 'center' }} onClick={() => setRecibido(q)}>
                          {q === total ? 'Exacto' : fmtCOP(q, { short: true })}
                        </button>
                      ))}
                    </div>
                    {recibido >= total && (
                      <div style={{ marginTop: 14, padding: '12px 14px', background: 'var(--accent-soft)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--accent)', fontSize: 12 }}>Cambio</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)' }}>{fmtCOP(cambio)}</span>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowPayModal(false)}>Cancelar</button>
                  <button className="btn primary" style={{ flex: 2, justifyContent: 'center', padding: 12 }} disabled={!payMethod || (payMethod === 'Efectivo' && recibido < total)} onClick={completarPago}>
                    Confirmar pago
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: '30px 20px', textAlign: 'center' }}>
                <div className="pay-spinner" />
                <div style={{ marginTop: 20, fontSize: 14 }}>Procesando pago…</div>
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-3)' }}>{payMethod}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SumLine({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: muted ? 'var(--text-3)' : 'var(--text-2)', padding: '3px 0' }}>
      <span>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)' }}>{fmtCOP(value)}</span>
    </div>
  )
}
