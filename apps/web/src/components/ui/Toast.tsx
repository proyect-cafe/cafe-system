import { createContext, useCallback, useContext, useState } from 'react'

interface ToastItem {
  id: string
  msg: string
  color?: string
  duration?: number
}

interface ToastContextValue {
  push: (msg: string, opts?: Partial<ToastItem>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.push
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const push = useCallback((msg: string, opts: Partial<ToastItem> = {}) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, msg, ...opts }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, opts.duration ?? 2400)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <span className="dot-ind" style={{ color: t.color ?? 'var(--accent)' }} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
