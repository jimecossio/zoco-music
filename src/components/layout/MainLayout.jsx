// src/components/layout/MainLayout.jsx
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Player from '../player/Player';
import NowPlayingSidebar from './NowPlayingSidebar';

const MAIN_ROUTES = ['/', '/search', '/library', '/favorites'];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMainRoute = MAIN_ROUTES.includes(location.pathname);
  const showBackButton = !isMainRoute;

  return (
    <div className="flex h-screen bg-bg-base text-text-body overflow-hidden">
      {/* Sidebar fijo para desktop */}
      <Sidebar />

      {/* Contenedor principal scrollable */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Cabecera Móvil: Flecha atrás a la izquierda (solo si es útil en páginas secundarias/detalle), Logo al centro, Perfil a la derecha */}
        <header className="md:hidden sticky top-0 z-30 bg-bg-base/95 backdrop-blur-md px-3.5 py-2.5 border-b border-border-subtle/80 flex items-center justify-between shadow-2xs">
          {/* Esquina superior izquierda: Botón volver atrás (solo en vistas de detalle) */}
          <div className="w-9 flex items-center justify-start shrink-0">
            {showBackButton && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Volver atrás"
                className="w-9 h-9 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-brand-secondary hover:bg-bg-surface-active active:scale-90 transition-all shadow-2xs cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}
          </div>

          {/* Centro: Logo oficial de ZOCO Music */}
          <Link to="/" className="flex items-center justify-center select-none">
            <img
              src="/logo.png"
              alt="ZOCO Music"
              className="h-7 w-auto object-contain"
            />
          </Link>

          {/* Esquina superior derecha: Avatar genérico de usuario */}
          <div className="w-9 flex items-center justify-end shrink-0">
            <div
              title="Mi Perfil"
              className="w-9 h-9 rounded-full bg-brand-primary/20 text-brand-primary-dark border-2 border-brand-primary flex items-center justify-center font-bold text-xs shadow-xs cursor-pointer active:scale-95 transition-transform select-none"
            >
              <User size={18} className="text-brand-primary-dark" />
            </div>
          </div>
        </header>

        {/* Botón de volver atrás en Desktop (solo visible en páginas de detalle como álbumes o artistas) */}
        {showBackButton && (
          <div className="hidden md:flex items-center px-6 md:px-8 pt-6 pb-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Volver atrás"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-surface border border-border-subtle text-brand-secondary hover:bg-bg-surface-active hover:border-brand-primary-dark/40 active:scale-95 transition-all text-xs font-bold shadow-2xs cursor-pointer select-none group"
            >
              <ChevronLeft size={16} className="text-brand-secondary group-hover:-translate-x-0.5 transition-transform" />
              <span>Volver</span>
            </button>
          </div>
        )}

        <main className="flex-1 pb-36 md:pb-32">
          <Outlet />
        </main>
      </div>

      {/* Panel lateral derecho de Detalle en Grande (Reproduciendo Ahora) */}
      <NowPlayingSidebar />

      {/* Player persistente global */}
      <Player />

      {/* Navegación inferior solo para mobile */}
      <MobileNav />
    </div>
  );
}