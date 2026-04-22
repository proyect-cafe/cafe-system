import { Icon } from '@/components/ui/Icon'
import type { Tweaks, AccentId, ThemeId, DashLayout, ChartStyle } from '@/types'

const ACCENTS: { id: AccentId; color: string }[] = [
  { id: 'green', color: '#22c55e' },
  { id: 'indigo', color: '#6366f1' },
  { id: 'orange', color: '#f97316' },
  { id: 'teal', color: '#0f766e' },
  { id: 'blue', color: '#2563eb' },
]

interface TweaksPanelProps {
  open: boolean
  onClose: () => void
  tweaks: Tweaks
  setTweaks: React.Dispatch<React.SetStateAction<Tweaks>>
}

export function TweaksPanel({ open, onClose, tweaks, setTweaks }: TweaksPanelProps) {
  if (!open) return null

  const set = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) =>
    setTweaks((prev) => ({ ...prev, [k]: v }))

  return (
    <div className="tweaks-panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Tweaks</div>
        <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={onClose}>
          <Icon name="x" size={14} />
        </button>
      </div>

      {/* Modo Simple */}
      <div className="tweak-row" style={{ marginBottom: 18, paddingBottom: 18, borderBottom: '1px dashed var(--border)' }}>
        <div className="tweak-label" style={{ fontSize: 10, letterSpacing: '0.15em' }}>★ MODO DE VISTA</div>
        <button
          onClick={() => set('simpleMode', !tweaks.simpleMode)}
          style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: tweaks.simpleMode ? 'var(--accent-soft)' : 'var(--bg-3)',
            border: `1px solid ${tweaks.simpleMode ? 'var(--accent)' : 'var(--border)'}`,
            color: 'var(--text)',
            display: 'flex', alignItems: 'center', gap: 12,
            transition: 'all 0.2s', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 22 }}>{tweaks.simpleMode ? '🎮' : '📊'}</span>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2, color: tweaks.simpleMode ? 'var(--accent)' : 'var(--text)' }}>
              {tweaks.simpleMode ? 'Modo Simple · ACTIVO' : 'Modo Simple'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3, lineHeight: 1.3 }}>
              Dashboard gamificado — sin jerga técnica
            </div>
          </div>
          <span style={{
            width: 36, height: 22, borderRadius: 100,
            background: tweaks.simpleMode ? 'var(--accent)' : 'var(--bg-4)',
            position: 'relative', transition: 'all 0.2s', flexShrink: 0,
          }}>
            <span style={{
              position: 'absolute', top: 2,
              left: tweaks.simpleMode ? 16 : 2,
              width: 18, height: 18, borderRadius: '50%',
              background: tweaks.simpleMode ? '#000' : 'var(--text-2)',
              transition: 'left 0.2s',
            }} />
          </span>
        </button>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">Tema</div>
        <div className="seg">
          {(['dark', 'light'] as ThemeId[]).map((t) => (
            <button key={t} className={tweaks.theme === t ? 'on' : ''} onClick={() => set('theme', t)}>
              <Icon name={t === 'dark' ? 'moon' : 'sun'} size={12} /> {t === 'dark' ? 'Oscuro' : 'Claro'}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">Color de acento</div>
        <div className="swatch-row">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              className={`swatch ${tweaks.accent === a.id ? 'on' : ''}`}
              style={{ background: a.color }}
              onClick={() => set('accent', a.id)}
              title={a.id}
            />
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">Layout del dashboard</div>
        <div className="seg">
          {(['cards', 'editorial'] as DashLayout[]).map((l) => (
            <button key={l} className={tweaks.dashLayout === l ? 'on' : ''} onClick={() => set('dashLayout', l)}>
              {l === 'cards' ? 'Cards' : 'Editorial'}
            </button>
          ))}
        </div>
      </div>

      <div className="tweak-row">
        <div className="tweak-label">Estilo de gráficos</div>
        <div className="seg">
          {(['smooth', 'stepped', 'linear'] as ChartStyle[]).map((s) => (
            <button key={s} className={tweaks.chartStyle === s ? 'on' : ''} onClick={() => set('chartStyle', s)}>
              {s === 'smooth' ? 'Suave' : s === 'stepped' ? 'Escalón' : 'Recto'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        Usa <span className="kbd">T</span> para alternar el panel de tweaks.
      </div>
    </div>
  )
}

export function TweaksFab({ onClick }: { onClick: () => void }) {
  return (
    <button className="tweaks-fab" onClick={onClick} title="Tweaks (T)">
      <Icon name="settings" size={20} />
    </button>
  )
}
