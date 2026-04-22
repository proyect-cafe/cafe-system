import { useRef } from 'react'
import { CountUp } from '@/components/ui/CountUp'
import { Sparkline } from '@/components/ui/Charts'
import { Icon } from '@/components/ui/Icon'
import { fmtNum } from '@/lib/formatters'

interface KPIProps {
  label: string
  value: number
  delta: string
  trend: 'up' | 'down' | 'flat'
  sparkData: number[]
  formatter?: (n: number) => string
}

export function KPI({ label, value, delta, trend, sparkData, formatter = fmtNum }: KPIProps) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%')
    ref.current.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%')
  }

  return (
    <div className="kpi" ref={ref} onMouseMove={onMove}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value tabular">
        <CountUp value={value} formatter={formatter} />
      </div>
      <div className="kpi-foot">
        <span className={`delta ${trend}`}>
          <Icon name={trend === 'up' ? 'arrowUp' : trend === 'down' ? 'arrowDown' : 'minus'} size={10} />
          {delta}
        </span>
        <span>vs ayer</span>
        <span style={{ marginLeft: 'auto' }}>
          <Sparkline data={sparkData} color={trend === 'down' ? 'var(--danger)' : 'var(--accent)'} />
        </span>
      </div>
    </div>
  )
}

interface MiniStatProps {
  label: string
  value: number | string
  formatter?: (n: number) => string
  icon: string
  danger?: boolean
  accent?: boolean
}

export function MiniStat({ label, value, formatter, icon, danger, accent }: MiniStatProps) {
  const color = danger ? 'var(--danger)' : accent ? 'var(--accent)' : 'var(--text-2)'
  const bg = danger ? 'rgba(239,68,68,0.14)' : accent ? 'var(--accent-soft)' : 'var(--bg-3)'
  return (
    <div className="kpi">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: bg, color, display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={15} />
        </div>
        <div className="kpi-label" style={{ margin: 0, textTransform: 'uppercase' }}>{label}</div>
      </div>
      <div className="kpi-value tabular" style={{ marginTop: 10, fontSize: 32 }}>
        {typeof value === 'number'
          ? <CountUp value={value} formatter={formatter ?? fmtNum} />
          : value}
      </div>
    </div>
  )
}
