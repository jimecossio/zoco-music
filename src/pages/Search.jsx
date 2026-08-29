// src/pages/Search.jsx
import { useState, useEffect } from 'react';
import { Search as SearchIcon, X, Music, User, Disc, SlidersHorizontal } from 'lucide-react';
import { useSpotifyToken } from '../hooks/useSpotifyToken';
import { useDebounce } from '../hooks/useDebounce';
import { searchSpotify } from '../api/endpoints';
import TrackCard from '../components/cards/TrackCard';
import ArtistCard from '../components/cards/ArtistCard';
import AlbumCard from '../components/cards/AlbumCard';
import CategoryCard from '../components/cards/CategoryCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import MockNoticeBanner from '../components/common/MockNoticeBanner';

const CATEGORIES = [
  { id: 'pop', name: 'Pop', query: 'pop', bg: 'bg-[#FCE7F3]', border: 'border-pink-200/70', icon: '🎤' },
  { id: 'rock', name: 'Rock', query: 'rock', bg: 'bg-[#E0F2FE]', border: 'border-sky-200/70', icon: '🎸' },
  { id: 'chill', name: 'Chill', query: 'chill lofi', bg: 'bg-[#DCFCE7]', border: 'border-emerald-200/70', icon: '🍃' },
  { id: 'focus', name: 'Focus', query: 'deep focus', bg: 'bg-[#FEF3C7]', border: 'border-amber-200/70', icon: '🎧' },
  { id: 'podcast', name: 'Podcast', query: 'podcast show', bg: 'bg-[#EDE9FE]', border: 'border-purple-200/70', icon: '🎙️' },
  { id: 'urban', name: 'Urbano', query: 'reggaeton latino', bg: 'bg-[#FFEDD5]', border: 'border-orange-200/70', icon: '🔥' },
  { id: 'indie', name: 'Indie', query: 'indie alt', bg: 'bg-[#E0E7FF]', border: 'border-indigo-200/70', icon: '🌿' },
  { id: 'electronic', name: 'Electrónica', query: 'electronic dance edm', bg: 'bg-[#CCFBF1]', border: 'border-teal-200/70', icon: '⚡' },
];

const FILTER_TABS = [
  { id: 'all', label: 'Todo', icon: SlidersHorizontal },
  { id: 'tracks', label: 'Canciones', icon: Music },
  { id: 'artists', label: 'Artistas', icon: User },
  { id: 'albums', label: 'Álbumes', icon: Disc },
];

export default function Search() {
  const { token } = useSpotifyToken();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim();
    if (!trimmed || !token) {
      setResults(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    searchSpotify(trimmed, token)
      .then((data) => {
        if (isMounted) {
          setResults(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error al realizar la búsqueda en Spotify');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm, token]);

  const handleCategorySelect = (query) => {
    setSearchTerm(query);
  };

  const tracks = results?.tracks?.items || [];
  const artists = results?.artists?.items || [];
  const albums = results?.albums?.items || [];

  const isUsingMock = Boolean(
    results?._isMock ||
    tracks.some((t) => t?._isMock) ||
    albums.some((a) => a?._isMock) ||
    artists.some((art) => art?._isMock)
  );

  const hasResults =
    tracks.length > 0 || artists.length > 0 || albums.length > 0;

  const scrollGridClasses =
    'flex overflow-x-auto xl:grid xl:grid-cols-6 gap-3.5 sm:gap-4 pb-2.5 xl:pb-0 no-scrollbar snap-x snap-mandatory scroll-smooth';

  const fullGridClasses =
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 sm:gap-4';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="space-y-4 w-full">
        <div className="relative flex items-center">
          <SearchIcon
            size={20}
            className="absolute left-4 text-text-muted pointer-events-none"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="¿Qué querés escuchar? (artistas, canciones, álbumes)"
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-bg-surface border border-border-subtle focus:outline-none focus:border-brand-primary-dark focus:ring-2 focus:ring-brand-primary/20 text-brand-secondary placeholder:text-text-muted text-sm shadow-xs transition-all"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3.5 p-1 rounded-full text-text-muted hover:text-brand-secondary hover:bg-bg-surface-active transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Banner de aviso cuando los resultados de búsqueda provienen del mock */}
        {isUsingMock && hasResults && !loading && <MockNoticeBanner />}

        {/* Pestañas de filtro cuando hay resultados */}
        {debouncedSearchTerm.trim() && hasResults && !loading && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {FILTER_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveFilter(id)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none shrink-0 ${
                  activeFilter === id
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'bg-bg-surface border border-border-subtle/80 text-text-body hover:bg-bg-surface-active'
                }`}
              >
                <Icon size={13} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. ESTADO DE CARGA */}
      {loading && (
        <div className="space-y-6">
          <LoadingSkeleton count={4} variant="list" />
        </div>
      )}

      {/* 3. ESTADO DE ERROR */}
      {!loading && error && (
        <ErrorState
          title="Error en la búsqueda"
          message={error}
          onRetry={() => {
            const current = searchTerm;
            setSearchTerm('');
            setTimeout(() => setSearchTerm(current), 10);
          }}
        />
      )}

      {/* 4. RESULTADOS DE BÚSQUEDA */}
      {!loading && !error && debouncedSearchTerm.trim() && (
        <div className="space-y-10">
          {!hasResults && (
            <EmptyState
              icon={SearchIcon}
              title={`No encontramos resultados para "${debouncedSearchTerm}"`}
              description="Verifica que las palabras estén bien escritas o intenta con otro artista o canción."
            />
          )}

          {/* 4.1 CANCIONES */}
          {(activeFilter === 'all' || activeFilter === 'tracks') &&
            tracks.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-brand-secondary">
                    Canciones
                  </h2>
                  {activeFilter === 'all' && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter('tracks')}
                      className="text-xs text-text-muted hover:text-brand-primary-dark font-semibold transition-colors cursor-pointer"
                    >
                      Mostrar todas
                    </button>
                  )}
                </div>
                <div className="bg-bg-surface border border-border-subtle/70 rounded-3xl p-3 sm:p-4 divide-y divide-border-subtle/40 shadow-xs">
                  {tracks
                    .slice(0, activeFilter === 'all' ? 5 : undefined)
                    .map((track, idx) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        trackList={tracks}
                        index={idx}
                      />
                    ))}
                </div>
              </section>
            )}

          {/* 4.2 ARTISTAS */}
          {(activeFilter === 'all' || activeFilter === 'artists') &&
            artists.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-brand-secondary">
                    Artistas
                  </h2>
                  {activeFilter === 'all' && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter('artists')}
                      className="text-xs text-text-muted hover:text-brand-primary-dark font-semibold transition-colors cursor-pointer"
                    >
                      Mostrar todos
                    </button>
                  )}
                </div>
                <div
                  className={
                    activeFilter === 'all' ? scrollGridClasses : fullGridClasses
                  }
                >
                  {artists
                    .slice(0, activeFilter === 'all' ? 6 : undefined)
                    .map((artist) => (
                      <ArtistCard key={artist.id} artist={artist} />
                    ))}
                </div>
              </section>
            )}

          {/* 4.3 ÁLBUMES */}
          {(activeFilter === 'all' || activeFilter === 'albums') &&
            albums.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-brand-secondary">
                    Álbumes
                  </h2>
                  {activeFilter === 'all' && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter('albums')}
                      className="text-xs text-text-muted hover:text-brand-primary-dark font-semibold transition-colors cursor-pointer"
                    >
                      Mostrar todos
                    </button>
                  )}
                </div>
                <div
                  className={
                    activeFilter === 'all' ? scrollGridClasses : fullGridClasses
                  }
                >
                  {albums
                    .slice(0, activeFilter === 'all' ? 6 : undefined)
                    .map((album) => (
                      <AlbumCard key={album.id} album={album} />
                    ))}
                </div>
              </section>
            )}
        </div>
      )}

      {/* 5. EXPLORAR CATEGORÍAS (Cuando no hay término de búsqueda activo) */}
      {!debouncedSearchTerm.trim() && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
            Explorar géneros y estados de ánimo
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => handleCategorySelect(category.query)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}