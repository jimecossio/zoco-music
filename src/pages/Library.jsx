// src/pages/Library.jsx
import { useState, useEffect } from 'react';
import { Heart, History, Play, Trash2, Search as SearchIcon, Compass } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { usePlayer } from '../context/PlayerContext';
import TrackCard from '../components/cards/TrackCard';
import EmptyState from '../components/common/EmptyState';

export default function Library() {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, recents, clearRecents } = useFavorites();
  const { playTrack } = usePlayer();

  const isFavoritesRoute = location.pathname === '/favorites';
  const [activeTab, setActiveTab] = useState(isFavoritesRoute ? 'favorites' : 'recents');
  const [query, setQuery] = useState('');

  // Sincronizar activeTab cuando cambia la ruta en la barra de direcciones o sidebar
  useEffect(() => {
    setActiveTab(location.pathname === '/favorites' ? 'favorites' : 'recents');
  }, [location.pathname]);

  const currentList = activeTab === 'favorites' ? favorites : recents;

  const filteredList = currentList.filter((track) => {
    const q = query.toLowerCase();
    const nameMatch = track.name?.toLowerCase().includes(q);
    const artistMatch = track.artists?.some((a) =>
      a.name?.toLowerCase().includes(q)
    );
    return nameMatch || artistMatch;
  });

  const handlePlayAll = () => {
    if (filteredList.length > 0) {
      playTrack(filteredList[0], filteredList);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setQuery('');
    navigate(tab === 'favorites' ? '/favorites' : '/library');
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* 1. HEADER DE BIBLIOTECA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle/80">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-secondary tracking-tight">
            {activeTab === 'favorites' ? 'Canciones Favoritas' : 'Tu Biblioteca'}
          </h1>
          <p className="text-xs text-text-muted mt-1">
            {activeTab === 'favorites'
              ? 'Todas las canciones que marcaste con me gusta'
              : 'Tu historial de reproducción y actividad reciente'}
          </p>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center gap-2 bg-bg-surface p-1.5 rounded-2xl border border-border-subtle/80 shrink-0">
          <button
            type="button"
            onClick={() => handleTabChange('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-brand-primary text-brand-primary-dark shadow-xs'
                : 'text-text-muted hover:text-brand-secondary'
            }`}
          >
            <Heart size={15} className={activeTab === 'favorites' ? 'fill-current' : ''} />
            <span>Favoritos ({favorites.length})</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('recents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'recents'
                ? 'bg-brand-primary text-brand-primary-dark shadow-xs'
                : 'text-text-muted hover:text-brand-secondary'
            }`}
          >
            <History size={15} />
            <span>Historial ({recents.length})</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA DE ACCIONES (BUSCADOR LOCAL Y BOTONES) */}
      {currentList.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <SearchIcon
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Filtrar ${activeTab === 'favorites' ? 'favoritos' : 'historial'}...`}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-surface border border-border-subtle text-xs text-brand-secondary placeholder:text-text-muted focus:outline-none focus:border-brand-primary-dark"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {filteredList.length > 0 && (
              <button
                type="button"
                onClick={handlePlayAll}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary-dark text-white text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <Play size={14} fill="white" /> Reproducir lista
              </button>
            )}

            {activeTab === 'recents' && recents.length > 0 && (
              <button
                type="button"
                onClick={clearRecents}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-bg-surface border border-border-subtle text-text-muted hover:text-rose-500 hover:border-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Limpiar historial
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. LISTADO DE CANCIONES O EMPTY STATE */}
      {filteredList.length > 0 ? (
        <div className="bg-bg-surface border border-border-subtle/70 rounded-3xl p-3 sm:p-4 divide-y divide-border-subtle/40 shadow-xs">
          {filteredList.map((track, idx) => (
            <TrackCard
              key={track.id || idx}
              track={track}
              trackList={filteredList}
              index={idx}
              showAlbum
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            activeTab === 'favorites'
              ? 'No tenés canciones favoritas aún'
              : 'No hay canciones en tu historial'
          }
          message={
            query
              ? `No encontramos canciones que coincidan con "${query}".`
              : activeTab === 'favorites'
              ? 'Guardá tus canciones favoritas haciendo clic en el icono de corazón ❤️ mientras explorás.'
              : 'Las pistas que reproduzcas se guardarán automáticamente aquí.'
          }
          action={
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary text-brand-primary-dark font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-xs"
            >
              <Compass size={15} /> Explorar música
            </Link>
          }
        />
      )}
    </div>
  );
}