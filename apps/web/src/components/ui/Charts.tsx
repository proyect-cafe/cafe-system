import { useEffect, useId, useState } from 'react'
import { fmtCOP } from '@/lib/formatters'

type ChartStyle = 'smooth' | 'stepped' | 'linear'
export type BarChartDatum = Record<string, number | string>

interface LineChartProps {
  data: number[]
  width?: number
  height?: number
  style?: ChartStyle
  color?: string
  fill?: boolean
  showDots?: boolean
  animated?: boolean
  compare?: number[]
  yFormatter?: (n: number) => string
}

export function LineChart({
  data,
  width = 600,
  height = 160,
  style = 'smooth',
  color,
  fill = true,
  showDots = false,
  animated = true,
  compare,
  yFormatter = (n) => fmtCOP(n, { short: true }),
}: LineChartProps) {
  const pad = { t: 12, r: 12, b: 24, l: 44 }
  const W = width, H = height
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b
  const allVals = [...data, ...(compare ?? [])]
  const max = Math.max(...allVals) * 1.1
  const min = 0

  const toXY = (v: number, i: number, len: number): [number, number] => [
    pad.l + (i / (len - 1)) * innerW,
    pad.t + innerH - ((v - min) / (max - min)) * innerH,
  ]

  const makePath = (arr: number[]) => {
    const pts = arr.map((v, i) => toXY(v, i, arr.length))
    if (style === 'stepped') {
      let d = `M ${pts[0][0]} ${pts[0][1]}`
      for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i]
        d += ` L ${x} ${pts[i - 1][1]} L ${x} ${y}`
      }
      return { d, pts }
    }
    if (style === 'smooth') {
      let d = `M ${pts[0][0]} ${pts[0][1]}`
      for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i]
        const [px, py] = pts[i - 1]
        const cx = (px + x) / 2
        d += ` C ${cx} ${py}, ${cx} ${y}, ${x} ${y}`
      }
      return { d, pts }
    }
    const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + ' ' + p[0] + ' ' + p[1]).join(' ')
    return { d, pts }
  }

  const main = makePath(data)
  const cmp = compare ? makePath(compare) : null
  const areaD =
    main.d +
    ` L ${main.pts[main.pts.length - 1][0]} ${pad.t + innerH} L ${main.pts[0][0]} ${pad.t + innerH} Z`

  const ticks = [0, 0.5, 1].map((f) => min + (max - min) * f)
  const [revealed, setRevealed] = useState(!animated)

  useEffect(() => {
    if (!animated) return
    const t = setTimeout(() => setRevealed(true), 30)
    return () => clearTimeout(t)
  }, [animated])

  const id = useId()
  const c = color ?? 'var(--accent)'

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => {
        const y = pad.t + innerH - ((t - min) / (max - min)) * innerH
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="var(--border)" strokeDasharray={i === 0 ? '0' : '2 4'} />
            <text x={pad.l - 8} y={y + 3} fontSize="10" fill="var(--text-3)" textAnchor="end" fontFamily="var(--font-mono)">
              {yFormatter(t)}
            </text>
          </g>
        )
      })}
      {cmp && (
        <path d={cmp.d} fill="none" stroke="var(--text-4)" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.5" />
      )}
      {fill && (
        <path
          d={areaD}
          fill={`url(#grad-${id})`}
          style={{ opacity: revealed ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}
        />
      )}
      <path
        d={main.d}
        fill="none"
        stroke={c}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: animated ? 3000 : undefined,
          strokeDashoffset: animated && !revealed ? 3000 : 0,
          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.2,0.8,0.2,1)',
        }}
      />
      {showDots &&
        main.pts.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r="2.5"
            fill={c}
            style={{ opacity: revealed ? 1 : 0, transition: `opacity 0.3s ease ${0.8 + i * 0.02}s` }}
          />
        ))}
    </svg>
  )
}

interface BarChartProps {
  data: BarChartDatum[]
  accent?: string
  width?: number
  height?: number
  keyProp?: string
  labelProp?: string
  fmtY?: (n: number) => string
}

export function BarChart({
  data,
  accent,
  width = 600,
  height = 160,
  keyProp = 'v',
  labelProp = 'h',
  fmtY = (n) => fmtCOP(n, { short: true }),
}: BarChartProps) {
  const pad = { t: 12, r: 8, b: 22, l: 44 }
  const W = width, H = height
  const innerW = W - pad.l - pad.r
  const innerH = H - pad.t - pad.b
  const vals = data.map((d) => d[keyProp] as number)
  const max = Math.max(...vals) * 1.1
  const barW = innerW / data.length
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 40)
    return () => clearTimeout(t)
  }, [])

  const c = accent ?? 'var(--accent)'
  const ticks = [0, 0.5, 1].map((f) => max * f)
  const peak = Math.max(...vals)

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {ticks.map((t, i) => {
        const y = pad.t + innerH - (t / max) * innerH
        return (
          <g key={i}>
            <line x1={pad.l} x2={W - pad.r} y1={y} y2={y} stroke="var(--border)" strokeDasharray={i === 0 ? '0' : '2 4'} />
            <text x={pad.l - 8} y={y + 3} fontSize="10" fill="var(--text-3)" textAnchor="end" fontFamily="var(--font-mono)">{fmtY(t)}</text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const v = d[keyProp] as number
        const h = (v / max) * innerH
        const x = pad.l + i * barW + 3
        const w = barW - 6
        const y = pad.t + innerH - h
        const isPeak = v === peak
        return (
          <g key={i}>
            <rect
              x={x}
              y={revealed ? y : pad.t + innerH}
              width={w}
              height={revealed ? h : 0}
              fill={isPeak ? c : 'var(--border-strong)'}
              rx="3"
              style={{ transition: `all 0.6s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.015}s` }}
            />
            {i % 2 === 0 && (
              <text x={x + w / 2} y={H - 6} fontSize="10" fill="var(--text-3)" textAnchor="middle" fontFamily="var(--font-mono)">
                {d[labelProp] as string}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

interface DonutSegment {
  value: number
  color: string
}

interface DonutProps {
  segments: DonutSegment[]
  size?: number
  thickness?: number
  centerLabel?: string
  centerValue?: string
}

export function Donut({ segments, size = 140, thickness = 16, centerLabel, centerValue }: DonutProps) {
  const r = size / 2 - thickness / 2
  const c = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60)
    return () => clearTimeout(t)
  }, [])

  let offset = 0
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--bg-3)" strokeWidth={thickness} fill="none" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={`${revealed ? len : 0} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: `stroke-dasharray 0.8s cubic-bezier(0.2,0.8,0.2,1) ${i * 0.08}s` }}
            />
          )
          offset += len
          return el
        })}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{centerLabel}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1, marginTop: 4 }}>{centerValue}</div>
        </div>
      </div>
    </div>
  )
}

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
}

export function Sparkline({ data, width = 80, height = 28, color = 'var(--accent)' }: SparklineProps) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - ((v - min) / (max - min || 1)) * height * 0.9 - 2,
  ])
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
