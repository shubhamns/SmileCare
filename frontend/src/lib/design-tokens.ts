export const colors = {
  primary: "#0d9488",
  primaryHover: "#0f766e",
  primarySubtle: "#f0fdfa",
  primaryMuted: "#ecfdf8",
  navy: "#0f172a",
  navySidebar: "#152032",
  navyHover: "#1e2a3b",
  pageBg: "#f8fafc",
  bookingBg: "#eef2f6",
  adminBg: "#f4f6f9",
  border: "#e2e8f0",
  textBody: "#64748b",
  textHeading: "#0f172a",
  success: "#22c55e",
  warning: "#f97316",
  danger: "#ef4444",
} as const;
export const layout = {
  containerMax: "1200px",
  headerHeight: "72px",
  sidebarWidth: "240px",
  bookingMax: "720px",
  confirmMax: "480px",
} as const;
export const radius = {
  button: "8px",
  card: "12px",
  cardLg: "16px",
  hero: "20px",
  pill: "9999px",
} as const;
export const shadow = {
  card: "0 4px 24px -4px rgba(0,0,0,0.08)",
  hero: "0 25px 60px -15px rgba(15,23,42,0.18)",
  selected: "0 0 0 4px rgba(13,148,136,0.12)",
} as const;
export const spacing = {
  sectionY: "4rem",
  sectionYLg: "5rem",
  cardPadding: "1.25rem",
  gridGapSm: "0.75rem",
  gridGapMd: "1.25rem",
} as const;
export const typography = {
  fontUi: '"Inter", system-ui, sans-serif',
  fontAccent: '"Caveat", cursive',
  hero: "clamp(2.625rem, 5vw, 3.25rem)",
  section: "clamp(1.875rem, 3vw, 2.25rem)",
  body: "0.9375rem",
  caption: "0.6875rem",
} as const;
