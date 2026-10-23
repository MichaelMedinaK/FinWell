import { ArrowLeftRight, Bell, CreditCard, LayoutDashboard, type LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  showsAlertCount?: boolean;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: '/', label: 'Resumen', shortLabel: 'Inicio', icon: LayoutDashboard },
  { href: '/movimientos', label: 'Movimientos', shortLabel: 'Movimientos', icon: ArrowLeftRight },
  { href: '/deudas', label: 'Deudas y tarjetas', shortLabel: 'Deudas', icon: CreditCard },
  { href: '/alertas', label: 'Alertas', shortLabel: 'Alertas', icon: Bell, showsAlertCount: true },
];

export function isActivePath(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}
