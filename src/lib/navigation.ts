export interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Peta", end: true },
  { to: "/ringkasan", label: "Ringkasan" },
  { to: "/metodologi", label: "Metodologi" },
  { to: "/tentang", label: "Tentang" },
];

export const MAP_DEFAULTS = {
  minZoom: 10,
  maxZoom: 18,
  defaultZoom: 12.35,
};
