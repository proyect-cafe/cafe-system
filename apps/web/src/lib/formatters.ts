interface FmtCOPOptions {
  short?: boolean
  symbol?: boolean
}

export function fmtCOP(n: number, opts: FmtCOPOptions = {}): string {
  const { short = false, symbol = true } = opts
  if (short && Math.abs(n) >= 1_000_000) {
    return (symbol ? '$' : '') + (n / 1_000_000).toFixed(1) + 'M'
  }
  if (short && Math.abs(n) >= 1_000) {
    return (symbol ? '$' : '') + Math.round(n / 1_000) + 'k'
  }
  const s = Math.round(n).toLocaleString('es-CO', { minimumFractionDigits: 0 })
  return (symbol ? '$ ' : '') + s
}

export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString('es-CO')
}
