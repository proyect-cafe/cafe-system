import { useCountUp } from '@/hooks/useCountUp'
import { fmtNum } from '@/lib/formatters'

interface CountUpProps {
  value: number
  formatter?: (n: number) => string
  duration?: number
  className?: string
}

export function CountUp({ value, formatter = fmtNum, duration = 900, className }: CountUpProps) {
  const v = useCountUp(value, duration)
  return <span className={className}>{formatter(v)}</span>
}
