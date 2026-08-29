// src/components/layout/Topbar.jsx
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle/50">
      {/* Botones de navegación del historial (Izquierda) */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Ir atrás"
          className="w-8 h-8 rounded-full bg-bg-surface border border-border-subtle/60 flex items-center justify-center text-brand-secondary hover:bg-bg-surface-active hover:scale-105 transition-all shadow-2xs cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Ir adelante"
          className="w-8 h-8 rounded-full bg-bg-surface border border-border-subtle/60 flex items-center justify-center text-brand-secondary hover:bg-bg-surface-active hover:scale-105 transition-all shadow-2xs cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Logo en el centro para pantallas móviles / responsive */}
      <div className="md:hidden flex items-center justify-center flex-1 px-2">
        <Link to="/" className="inline-flex items-center select-none">
          <img
            src="/logo.png"
            alt="ZOCO Music"
            className="h-7 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Badge / Estado del sistema (Derecha) */}
      <div className="flex items-center justify-end shrink-0 min-w-[70px] sm:min-w-[140px]">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/20 border border-brand-primary/40 text-brand-primary-dark text-xs font-semibold">
          <Sparkles size={13} className="text-brand-primary-dark" />
          <span>Spotify API Conectada</span>
        </div>
      </div>
    </header>
  );
}
