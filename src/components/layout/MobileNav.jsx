// src/components/layout/MobileNav.jsx
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart } from 'lucide-react';

const mobileNavItems = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/search', label: 'Buscador', icon: Search, end: false },
  { to: '/library', label: 'Biblioteca', icon: Library, end: true },
  { to: '/favorites', label: 'Favoritos', icon: Heart, end: true },
];

export default function MobileNav() {
  const getMobileLinkClasses = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 flex-1 py-2 text-xs transition-all ${
      isActive
        ? 'text-brand-primary-dark font-bold scale-105'
        : 'text-text-muted hover:text-brand-secondary'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-surface/95 backdrop-blur-lg border-t border-border-subtle flex items-center justify-around px-2 z-40 shadow-lg">
      {mobileNavItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={getMobileLinkClasses}>
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}