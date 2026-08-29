
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, User } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';

export default function Sidebar() {
  const { favorites } = useFavorites();

  const getLinkClasses = ({ isActive }) =>
    `flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all select-none ${
      isActive
        ? 'bg-brand-primary text-white font-bold shadow-xs'
        : 'text-text-muted hover:text-brand-secondary hover:bg-bg-surface-active'
    }`;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-bg-surface border-r border-border-subtle p-5 h-screen justify-between shrink-0 select-none">
      <div className="space-y-6">

        <div className="px-2 py-1">
          <img
            src="/logo.png"
            alt="ZOCO Music"
            className="h-8 w-auto object-contain"
          />
        </div>

        <nav className="space-y-1.5">
          <NavLink to="/" end className={getLinkClasses}>
            <Home size={19} />
            <span>Inicio</span>
          </NavLink>

          <NavLink to="/search" end className={getLinkClasses}>
            <Search size={19} />
            <span>Buscador</span>
          </NavLink>

          <NavLink to="/library" end className={getLinkClasses}>
            <Library size={19} />
            <span>Tu Biblioteca</span>
          </NavLink>
        </nav>

        <hr className="border-border-subtle my-2" />

        <div className="space-y-2">
          <NavLink to="/favorites" end className={getLinkClasses}>
            {({ isActive }) => (
              <>
                <Heart
                  size={19}
                  className={isActive ? 'text-white fill-white/30' : 'text-rose-500 fill-rose-500/20'}
                />
                <div className="flex items-center justify-between flex-1">
                  <span>Favoritos</span>
                  {favorites.length > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        isActive
                          ? 'bg-black/20 text-white'
                          : 'bg-bg-surface-active text-text-muted'
                      }`}
                    >
                      {favorites.length}
                    </span>
                  )}
                </div>
              </>
            )}
          </NavLink>
        </div>
      </div>

      <div className="pt-4 border-t border-border-subtle/70">
        <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-bg-surface-active transition-all cursor-pointer group select-none">
          <div className="relative w-10 h-10 rounded-full bg-brand-primary/20 text-brand-primary-dark border-2 border-brand-primary flex items-center justify-center shrink-0 shadow-xs font-bold">
            <User size={20} className="text-brand-primary-dark" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-white" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs sm:text-sm text-brand-secondary truncate group-hover:text-brand-primary transition-colors">
              Mi Perfil
            </p>
            <span className="text-[11px] text-text-muted font-medium block truncate">
              Cuenta Premium
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}