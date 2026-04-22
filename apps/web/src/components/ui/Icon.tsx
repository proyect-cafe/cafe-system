interface IconProps {
  name: string
  size?: number
  stroke?: number
}

const paths: Record<string, React.ReactNode> = {
  dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
  pos: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M8 15h2"/></>,
  products: <><path d="M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></>,
  inventory: <><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></>,
  purchases: <><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l3 13h12l3-9H6"/></>,
  employees: <><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
  reports: <><path d="M3 21V7l6-4 6 4v14"/><path d="M15 21V11l6 4v6"/><path d="M9 11h.01"/><path d="M9 15h.01"/><path d="M9 7h.01"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  bell: <><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 004 0"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  minus: <><path d="M5 12h14"/></>,
  x: <><path d="M18 6L6 18M6 6l12 12"/></>,
  check: <><path d="M20 6L9 17l-5-5"/></>,
  arrowUp: <><path d="M7 17L17 7M17 7H7M17 7v10"/></>,
  arrowDown: <><path d="M17 7L7 17M7 17h10M7 17V7"/></>,
  arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  trendUp: <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
  trendDown: <><path d="M3 7l6 6 4-4 8 8"/><path d="M14 17h7v-7"/></>,
  alert: <><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></>,
  flame: <><path d="M8.5 14.5A3.5 3.5 0 0012 18a3.5 3.5 0 003.5-3.5c0-1.6-1.5-2.5-2-4 0 0-1 2-2.5 2-.5-1-1.5-1.5-2.5-2"/><path d="M12 22C7 22 3 18 3 13c0-3 2-5 3-7 1 2 3 3 4 3 0-3 2-5 4-7 3 2 5 5 5 8 1 2 3 4 3 7 0 5-4 9-10 9z"/></>,
  zombie: <><circle cx="9" cy="9" r="1.5"/><circle cx="15" cy="9" r="1.5"/><path d="M3 12a9 9 0 1118 0 9 9 0 01-18 0z"/><path d="M8 15c2 1 6 1 8 0"/></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 10v.01M18 14v.01"/></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>,
  mobile: <><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M12 18h.01"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33h.02a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.02a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  package: <><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></>,
  truck: <><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-4l-3-5h-5v9h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
  filter: <><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  moon: <><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></>,
  sparkles: <><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z"/><path d="M19 13l.9 2.3L22 16l-2.1.7L19 19l-.9-2.3L16 16l2.1-.7L19 13z"/></>,
  coffee: <><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><path d="M6 1v3M10 1v3M14 1v3"/></>,
  trash: <><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></>,
  edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  star: <><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z"/></>,
  target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
  boxes: <><path d="M2.97 12.92A2 2 0 002 14.63V18a2 2 0 001.03 1.75l5 2.86a2 2 0 002 0l5-2.86A2 2 0 0016 18v-3.37a2 2 0 00-.97-1.71l-5-2.85a2 2 0 00-2 0l-5 2.85z"/><path d="M8 22v-7.5l5-2.75M8 14.5l-5-2.75M20.93 15.08L16 12.25"/><path d="M16 12.25v-3.5l5-2.75v3.5l-5 2.75z"/></>,
}

export function Icon({ name, size = 18, stroke = 1.75 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? null}
    </svg>
  )
}
