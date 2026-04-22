export interface Categoria {
  id: string
  nombre: string
  color: string
  icon: string
}

export interface Producto {
  id: string
  nombre: string
  cat: string
  precio: number
  costo: number
  stock: number
  unidad: string
  vendidos30d: number
  tendencia: 'up' | 'down' | 'flat'
  proveedor: string
}

export interface Empleado {
  id: string
  nombre: string
  rol: string
  turno: string
  estado: 'activo' | 'descanso'
  ventasHoy: number
  transHoy: number
  hrs: number
  foto: string
  color: string
}

export interface Compra {
  id: string
  proveedor: string
  fecha: string
  total: number
  items: number
  estado: 'recibido' | 'pendiente' | 'en_camino'
}

export interface VentaHora {
  h: string
  v: number
}

export interface Transaccion {
  id: string
  hora: string
  items: number
  total: number
  metodo: string
  cajero: string
}

export interface KPIs {
  ventasHoy: number
  costoHoy: number
  gananciaHoy: number
  transHoy: number
  ticketPromedio: number
  ventas30d: number
  costos30d: number
  ganancia30d: number
  margen: string
  ventas15d: number
  ganancia15d: number
}

export interface POSData {
  CATEGORIAS: Categoria[]
  PRODUCTOS: Producto[]
  EMPLEADOS: Empleado[]
  COMPRAS: Compra[]
  VENTAS_30D: number[]
  COSTOS_30D: number[]
  TICKETS_30D: number[]
  VENTAS_HORA: VentaHora[]
  TRANSACCIONES: Transaccion[]
  KPIs: KPIs
}

export type PageId =
  | 'dashboard'
  | 'pos'
  | 'products'
  | 'inventory'
  | 'purchases'
  | 'employees'
  | 'reports'

export type ChartStyle = 'smooth' | 'stepped' | 'linear'
export type DashLayout = 'cards' | 'editorial'
export type AccentId = 'green' | 'indigo' | 'orange' | 'teal' | 'blue'
export type ThemeId = 'dark' | 'light'

export interface Tweaks {
  theme: ThemeId
  accent: AccentId
  dashLayout: DashLayout
  chartStyle: ChartStyle
  simpleMode: boolean
}
