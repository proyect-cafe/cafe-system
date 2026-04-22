import type { POSData, KPIs } from '@/types'

const CATEGORIAS = [
  { id: 'bebidas', nombre: 'Bebidas', color: '#22c55e', icon: '◐' },
  { id: 'panaderia', nombre: 'Panadería', color: '#f59e0b', icon: '◑' },
  { id: 'abarrotes', nombre: 'Abarrotes', color: '#8b5cf6', icon: '◒' },
  { id: 'lacteos', nombre: 'Lácteos', color: '#06b6d4', icon: '◓' },
  { id: 'snacks', nombre: 'Snacks', color: '#ec4899', icon: '●' },
  { id: 'preparados', nombre: 'Preparados', color: '#84cc16', icon: '◆' },
  { id: 'limpieza', nombre: 'Limpieza', color: '#64748b', icon: '■' },
]

const PRODUCTOS = [
  { id: 'p01', nombre: 'Café Americano 12oz', cat: 'bebidas', precio: 4500, costo: 1200, stock: 120, unidad: 'taza', vendidos30d: 842, tendencia: 'up' as const, proveedor: 'Tostadora Andina' },
  { id: 'p02', nombre: 'Cappuccino 12oz', cat: 'bebidas', precio: 6500, costo: 1800, stock: 98, unidad: 'taza', vendidos30d: 612, tendencia: 'up' as const, proveedor: 'Tostadora Andina' },
  { id: 'p03', nombre: 'Latte Vainilla', cat: 'bebidas', precio: 7500, costo: 2100, stock: 64, unidad: 'taza', vendidos30d: 498, tendencia: 'up' as const, proveedor: 'Tostadora Andina' },
  { id: 'p04', nombre: 'Jugo Natural Mora', cat: 'bebidas', precio: 6000, costo: 2400, stock: 32, unidad: 'vaso', vendidos30d: 287, tendencia: 'flat' as const, proveedor: 'Frutas del Valle' },
  { id: 'p05', nombre: 'Agua con Gas 600ml', cat: 'bebidas', precio: 3500, costo: 1500, stock: 84, unidad: 'botella', vendidos30d: 412, tendencia: 'up' as const, proveedor: 'Distribuidora Postobón' },
  { id: 'p06', nombre: 'Coca-Cola 400ml', cat: 'bebidas', precio: 3800, costo: 1900, stock: 156, unidad: 'botella', vendidos30d: 687, tendencia: 'flat' as const, proveedor: 'Distribuidora Postobón' },
  { id: 'p07', nombre: 'Té Helado Durazno', cat: 'bebidas', precio: 4200, costo: 1650, stock: 12, unidad: 'botella', vendidos30d: 143, tendencia: 'down' as const, proveedor: 'Distribuidora Postobón' },
  { id: 'p08', nombre: 'Croissant Mantequilla', cat: 'panaderia', precio: 4800, costo: 1400, stock: 24, unidad: 'unidad', vendidos30d: 723, tendencia: 'up' as const, proveedor: 'Panadería La Francesa' },
  { id: 'p09', nombre: 'Pan de Chocolate', cat: 'panaderia', precio: 5200, costo: 1600, stock: 18, unidad: 'unidad', vendidos30d: 534, tendencia: 'up' as const, proveedor: 'Panadería La Francesa' },
  { id: 'p10', nombre: 'Pandebono', cat: 'panaderia', precio: 2500, costo: 700, stock: 56, unidad: 'unidad', vendidos30d: 1247, tendencia: 'up' as const, proveedor: 'Panadería La Francesa' },
  { id: 'p11', nombre: 'Almojábana', cat: 'panaderia', precio: 2800, costo: 850, stock: 42, unidad: 'unidad', vendidos30d: 892, tendencia: 'up' as const, proveedor: 'Panadería La Francesa' },
  { id: 'p12', nombre: 'Muffin Arándanos', cat: 'panaderia', precio: 5500, costo: 2100, stock: 8, unidad: 'unidad', vendidos30d: 178, tendencia: 'down' as const, proveedor: 'Panadería La Francesa' },
  { id: 'p13', nombre: 'Sandwich Jamón & Queso', cat: 'preparados', precio: 12500, costo: 4200, stock: 14, unidad: 'unidad', vendidos30d: 312, tendencia: 'up' as const, proveedor: 'Cocina interna' },
  { id: 'p14', nombre: 'Wrap de Pollo', cat: 'preparados', precio: 14500, costo: 5100, stock: 9, unidad: 'unidad', vendidos30d: 234, tendencia: 'up' as const, proveedor: 'Cocina interna' },
  { id: 'p15', nombre: 'Bowl Quinoa & Aguacate', cat: 'preparados', precio: 18500, costo: 7200, stock: 6, unidad: 'unidad', vendidos30d: 142, tendencia: 'up' as const, proveedor: 'Cocina interna' },
  { id: 'p16', nombre: 'Ensalada César', cat: 'preparados', precio: 16000, costo: 5800, stock: 5, unidad: 'unidad', vendidos30d: 98, tendencia: 'flat' as const, proveedor: 'Cocina interna' },
  { id: 'p17', nombre: 'Arroz Diana 500g', cat: 'abarrotes', precio: 4200, costo: 2800, stock: 78, unidad: 'paquete', vendidos30d: 234, tendencia: 'flat' as const, proveedor: 'Mayorista Central' },
  { id: 'p18', nombre: 'Aceite Girasol 1L', cat: 'abarrotes', precio: 12500, costo: 8400, stock: 42, unidad: 'botella', vendidos30d: 87, tendencia: 'flat' as const, proveedor: 'Mayorista Central' },
  { id: 'p19', nombre: 'Azúcar Manuelita 1kg', cat: 'abarrotes', precio: 4800, costo: 3200, stock: 62, unidad: 'paquete', vendidos30d: 156, tendencia: 'flat' as const, proveedor: 'Mayorista Central' },
  { id: 'p20', nombre: 'Pasta Doria 500g', cat: 'abarrotes', precio: 3800, costo: 2400, stock: 89, unidad: 'paquete', vendidos30d: 198, tendencia: 'up' as const, proveedor: 'Mayorista Central' },
  { id: 'p21', nombre: 'Frijoles Bola Roja', cat: 'abarrotes', precio: 5200, costo: 3400, stock: 4, unidad: 'libra', vendidos30d: 47, tendencia: 'down' as const, proveedor: 'Mayorista Central' },
  { id: 'p22', nombre: 'Leche Alpina 1L', cat: 'lacteos', precio: 4800, costo: 3100, stock: 48, unidad: 'caja', vendidos30d: 412, tendencia: 'flat' as const, proveedor: 'Alpina S.A.' },
  { id: 'p23', nombre: 'Yogurt Griego', cat: 'lacteos', precio: 6500, costo: 3200, stock: 28, unidad: 'vaso', vendidos30d: 298, tendencia: 'up' as const, proveedor: 'Alpina S.A.' },
  { id: 'p24', nombre: 'Queso Campesino 250g', cat: 'lacteos', precio: 9800, costo: 5600, stock: 16, unidad: 'paquete', vendidos30d: 134, tendencia: 'flat' as const, proveedor: 'Alpina S.A.' },
  { id: 'p25', nombre: 'Mantequilla Colanta', cat: 'lacteos', precio: 7200, costo: 4100, stock: 22, unidad: 'barra', vendidos30d: 89, tendencia: 'down' as const, proveedor: 'Colanta' },
  { id: 'p26', nombre: 'Papas Margarita', cat: 'snacks', precio: 3500, costo: 1700, stock: 94, unidad: 'bolsa', vendidos30d: 512, tendencia: 'up' as const, proveedor: 'Frito Lay' },
  { id: 'p27', nombre: 'Chocolatina Jet', cat: 'snacks', precio: 2200, costo: 1100, stock: 168, unidad: 'unidad', vendidos30d: 934, tendencia: 'up' as const, proveedor: 'Nutresa' },
  { id: 'p28', nombre: 'Galletas Festival', cat: 'snacks', precio: 3200, costo: 1600, stock: 76, unidad: 'paquete', vendidos30d: 267, tendencia: 'flat' as const, proveedor: 'Nutresa' },
  { id: 'p29', nombre: 'Maní Salado 100g', cat: 'snacks', precio: 4500, costo: 2200, stock: 8, unidad: 'bolsa', vendidos30d: 34, tendencia: 'down' as const, proveedor: 'Manitoba' },
  { id: 'p30', nombre: 'Jabón Rey 300g', cat: 'limpieza', precio: 3800, costo: 2300, stock: 54, unidad: 'barra', vendidos30d: 78, tendencia: 'flat' as const, proveedor: 'Mayorista Central' },
  { id: 'p31', nombre: 'Papel Higiénico x4', cat: 'limpieza', precio: 8500, costo: 5200, stock: 36, unidad: 'paquete', vendidos30d: 142, tendencia: 'flat' as const, proveedor: 'Familia' },
]

const EMPLEADOS = [
  { id: 'e1', nombre: 'Camila Ríos', rol: 'Cajera', turno: 'Mañana 6am-2pm', estado: 'activo' as const, ventasHoy: 1840000, transHoy: 47, hrs: 6.2, foto: 'CR', color: '#22c55e' },
  { id: 'e2', nombre: 'Andrés Mejía', rol: 'Barista', turno: 'Mañana 6am-2pm', estado: 'activo' as const, ventasHoy: 980000, transHoy: 62, hrs: 6.2, foto: 'AM', color: '#f59e0b' },
  { id: 'e3', nombre: 'Valentina López', rol: 'Cajera', turno: 'Tarde 2pm-10pm', estado: 'descanso' as const, ventasHoy: 0, transHoy: 0, hrs: 0, foto: 'VL', color: '#8b5cf6' },
  { id: 'e4', nombre: 'Santiago Ruiz', rol: 'Cocinero', turno: 'Partido', estado: 'activo' as const, ventasHoy: 0, transHoy: 0, hrs: 4.8, foto: 'SR', color: '#06b6d4' },
  { id: 'e5', nombre: 'Daniela Torres', rol: 'Admin', turno: 'Flexible', estado: 'activo' as const, ventasHoy: 0, transHoy: 0, hrs: 5.4, foto: 'DT', color: '#ec4899' },
]

const COMPRAS = [
  { id: 'c1', proveedor: 'Panadería La Francesa', fecha: '2026-04-16', total: 840000, items: 12, estado: 'recibido' as const },
  { id: 'c2', proveedor: 'Distribuidora Postobón', fecha: '2026-04-15', total: 1250000, items: 24, estado: 'recibido' as const },
  { id: 'c3', proveedor: 'Alpina S.A.', fecha: '2026-04-14', total: 680000, items: 8, estado: 'recibido' as const },
  { id: 'c4', proveedor: 'Mayorista Central', fecha: '2026-04-17', total: 2140000, items: 18, estado: 'pendiente' as const },
  { id: 'c5', proveedor: 'Tostadora Andina', fecha: '2026-04-12', total: 960000, items: 6, estado: 'recibido' as const },
  { id: 'c6', proveedor: 'Frutas del Valle', fecha: '2026-04-17', total: 320000, items: 14, estado: 'en_camino' as const },
  { id: 'c7', proveedor: 'Nutresa', fecha: '2026-04-10', total: 540000, items: 22, estado: 'recibido' as const },
]

function genSeries(base: number, variance: number, trend = 0): number[] {
  return Array.from({ length: 30 }, (_, i) => {
    const dayOfWeek = i % 7
    const weekendBoost = dayOfWeek === 5 || dayOfWeek === 6 ? 1.25 : 1
    const trendMult = 1 + (trend * i) / 30
    return Math.round(base * weekendBoost * trendMult * (1 + (Math.random() - 0.5) * variance))
  })
}

const VENTAS_30D = genSeries(2400000, 0.2, 0.15)
const COSTOS_30D = VENTAS_30D.map((v) => Math.round(v * (0.42 + Math.random() * 0.08)))
const TICKETS_30D = genSeries(145, 0.18, 0.12)

const VENTAS_HORA = [
  { h: '06', v: 180000 }, { h: '07', v: 420000 }, { h: '08', v: 680000 },
  { h: '09', v: 520000 }, { h: '10', v: 380000 }, { h: '11', v: 440000 },
  { h: '12', v: 890000 }, { h: '13', v: 1120000 }, { h: '14', v: 740000 },
  { h: '15', v: 380000 }, { h: '16', v: 520000 }, { h: '17', v: 680000 },
  { h: '18', v: 920000 }, { h: '19', v: 840000 }, { h: '20', v: 620000 },
  { h: '21', v: 340000 },
]

const TRANSACCIONES = [
  { id: 'T-8429', hora: '13:42', items: 3, total: 18400, metodo: 'Tarjeta', cajero: 'Camila' },
  { id: 'T-8428', hora: '13:38', items: 1, total: 4500, metodo: 'Efectivo', cajero: 'Camila' },
  { id: 'T-8427', hora: '13:35', items: 5, total: 34200, metodo: 'Nequi', cajero: 'Andrés' },
  { id: 'T-8426', hora: '13:31', items: 2, total: 11300, metodo: 'Tarjeta', cajero: 'Camila' },
  { id: 'T-8425', hora: '13:28', items: 4, total: 26800, metodo: 'Efectivo', cajero: 'Andrés' },
  { id: 'T-8424', hora: '13:24', items: 1, total: 6500, metodo: 'Tarjeta', cajero: 'Camila' },
  { id: 'T-8423', hora: '13:19', items: 7, total: 48200, metodo: 'Tarjeta', cajero: 'Andrés' },
  { id: 'T-8422', hora: '13:15', items: 2, total: 9800, metodo: 'Nequi', cajero: 'Camila' },
]

function computeKPIs(): KPIs {
  const ventasHoy = VENTAS_HORA.reduce((s, h) => s + h.v, 0)
  const costoHoy = Math.round(ventasHoy * 0.44)
  const gananciaHoy = ventasHoy - costoHoy
  const transHoy = 347
  const ticketPromedio = Math.round(ventasHoy / transHoy)
  const ventas30d = VENTAS_30D.reduce((a, b) => a + b, 0)
  const costos30d = COSTOS_30D.reduce((a, b) => a + b, 0)
  const ganancia30d = ventas30d - costos30d
  const margen = ((ganancia30d / ventas30d) * 100).toFixed(1)
  return {
    ventasHoy, costoHoy, gananciaHoy, transHoy, ticketPromedio,
    ventas30d, costos30d, ganancia30d, margen,
    ventas15d: Math.round(ventas30d * 0.52),
    ganancia15d: Math.round(ganancia30d * 0.54),
  }
}

export const POS_DATA: POSData = {
  CATEGORIAS,
  PRODUCTOS,
  EMPLEADOS,
  COMPRAS,
  VENTAS_30D,
  COSTOS_30D,
  TICKETS_30D,
  VENTAS_HORA,
  TRANSACCIONES,
  KPIs: computeKPIs(),
}
