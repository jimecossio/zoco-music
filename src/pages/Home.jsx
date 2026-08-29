// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Disc, Users, Flame, Headphones, Coffee, Zap, Play } from 'lucide-react';
import { getFeaturedAlbums, getFeaturedArtists, searchSpotify, getAlbum, getArtistTracks } from '../api/endpoints';
import { useSpotifyToken, getSpotifyToken } from '../hooks/useSpotifyToken';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';
import AlbumCard from '../components/cards/AlbumCard';
import ArtistCard from '../components/cards/ArtistCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import MockNoticeBanner from '../components/common/MockNoticeBanner';

const GENRE_FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'pop', label: '🎤 Pop' },
  { id: 'rock', label: '🎸 Rock' },
  { id: 'urban', label: '🔥 Urbano' },
  { id: 'chill', label: '☕ Chill & Relax' },
  { id: 'electronic', label: '⚡ Electrónica' },
];

export default function Home() {
  const navigate = useNavigate();
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken();
  const { playTrack } = usePlayer();
  const { addToRecents } = useFavorites();

  const [activeFilter, setActiveFilter] = useState('all');
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [rockAlbums, setRockAlbums] = useState([]);
  const [urbanAlbums, setUrbanAlbums] = useState([]);
  const [chillAlbums, setChillAlbums] = useState([]);
  const [electronicAlbums, setElectronicAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tokenLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.allSettled([
      getFeaturedAlbums(token),
      getFeaturedArtists(token),
      searchSpotify('rock classics', token),
      searchSpotify('reggaeton latino', token),
      searchSpotify('lofi chill beats', token),
      searchSpotify('electronic dance edm', token),
    ])
      .then(([albumsRes, artistsRes, rockRes, urbanRes, chillRes, electronicRes]) => {
        if (!isMounted) return;

        if (albumsRes.status === 'fulfilled') {
          setAlbums(albumsRes.value.slice(0, 6));
        }
        if (artistsRes.status === 'fulfilled') {
          setArtists(artistsRes.value.slice(0, 6));
        }
        if (rockRes.status === 'fulfilled' && rockRes.value?.albums?.items) {
          setRockAlbums(rockRes.value.albums.items.slice(0, 6));
        }
        if (urbanRes.status === 'fulfilled' && urbanRes.value?.albums?.items) {
          setUrbanAlbums(urbanRes.value.albums.items.slice(0, 6));
        }
        if (chillRes.status === 'fulfilled' && chillRes.value?.albums?.items) {
          setChillAlbums(chillRes.value.albums.items.slice(0, 6));
        }
        if (electronicRes.status === 'fulfilled' && electronicRes.value?.albums?.items) {
          setElectronicAlbums(electronicRes.value.albums.items.slice(0, 6));
        }

        if (
          albumsRes.status === 'rejected' &&
          artistsRes.status === 'rejected' &&
          rockRes.status === 'rejected'
        ) {
          setError('No se pudo cargar el contenido musical. Por favor, reintenta.');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Error al cargar la página de inicio');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token, tokenLoading]);

  // Detectar si algún dato proviene del dataset de contingencia (Mock)
  const isUsingMock =
    albums.some((a) => a?._isMock) ||
    artists.some((art) => art?._isMock) ||
    rockAlbums.some((a) => a?._isMock) ||
    urbanAlbums.some((a) => a?._isMock) ||
    chillAlbums.some((a) => a?._isMock) ||
    electronicAlbums.some((a) => a?._isMock);

  // Mensaje de saludo dinámico según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Reproducción instantánea desde los 6 accesos rápidos del Hero
  const handleQuickAccessPlay = async (e, item) => {
    e.stopPropagation();

    try {
      const activeToken = token || (await getSpotifyToken().catch(() => null));

      if (item.type === 'album') {
        const albumData = await getAlbum(item.id, activeToken);
        if (albumData?.tracks?.items?.length) {
          const fullTracks = albumData.tracks.items.map((t) => ({
            ...t,
            album: { images: albumData.images, name: albumData.name, id: albumData.id },
          }));
          playTrack(fullTracks[0], fullTracks);
          addToRecents(fullTracks[0]);
          return;
        }
      } else if (item.type === 'artist') {
        const tracksData = await getArtistTracks(item.title, activeToken);
        if (tracksData?.tracks?.items?.length) {
          playTrack(tracksData.tracks.items[0], tracksData.tracks.items);
          addToRecents(tracksData.tracks.items[0]);
          return;
        }
      }

      // Fallback de pista única
      const fallbackTrack = {
        id: item.id + '_tr',
        name: item.title,
        duration_ms: 180000,
        artists: [{ name: item.title }],
        album: { images: [{ url: item.image }], name: item.title, id: item.id },
      };
      playTrack(fallbackTrack, [fallbackTrack]);
      addToRecents(fallbackTrack);
    } catch (err) {
      console.warn('Error al reproducir acceso rápido:', err);
    }
  };

  // 1. Estado de carga inicial con esqueletos
  if (tokenLoading || (loading && !error && !tokenError)) {
    return (
      <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
        <LoadingSkeleton variant="header" />

        <section className="space-y-4">
          <div className="h-6 bg-border-subtle rounded w-48 animate-pulse" />
          <LoadingSkeleton count={6} variant="card" />
        </section>

        <section className="space-y-4">
          <div className="h-6 bg-border-subtle rounded w-48 animate-pulse" />
          <LoadingSkeleton count={6} variant="circle" />
        </section>
      </div>
    );
  }

  // 2. Estado de error
  if (tokenError || error || !token) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState
          title="Error de conexión"
          message={
            tokenError ||
            error ||
            'No se pudo autenticar con la Spotify API. Verifica tus credenciales en el archivo .env.'
          }
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Accesos rápidos de la cabecera (Exactamente 6 tarjetas)
  const quickAccessItems = [
    ...(albums.slice(0, 4).map((a) => ({
      id: a.id,
      title: a.name,
      image: a.images?.[0]?.url,
      link: `/album/${a.id}`,
      type: 'album',
    }))),
    ...(artists.slice(0, 2).map((art) => ({
      id: art.id,
      title: art.name,
      image: art.images?.[0]?.url,
      link: `/artist/${art.id}`,
      type: 'artist',
    }))),
  ].slice(0, 6);

  const scrollGridClasses =
    'flex overflow-x-auto xl:grid xl:grid-cols-6 gap-3.5 sm:gap-4 pb-2.5 xl:pb-0 no-scrollbar snap-x snap-mandatory scroll-smooth';

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* 1. BARRA DE BÚSQUEDA Y HERO */}
      <div className="space-y-4">
        {/* Buscador interactivo en Inicio que redirige a /search al hacer clic */}
        <div
          onClick={() => navigate('/search')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/search')}
          aria-label="Abrir buscador"
          className="relative flex items-center w-full bg-bg-surface border border-border-subtle hover:border-brand-primary rounded-2xl py-3.5 px-4 shadow-xs cursor-pointer group transition-all"
        >
          <SearchIcon size={19} className="text-text-muted group-hover:text-brand-primary mr-3 shrink-0 transition-colors" />
          <span className="text-sm text-text-muted group-hover:text-brand-secondary transition-colors">
            ¿Qué querés escuchar? (artistas, canciones, álbumes)
          </span>
        </div>

        {/* Banner de aviso cuando se usa dataset de contingencia */}
        {isUsingMock && <MockNoticeBanner />}

        {/* Cabecera del Hero con Saludo y Filtros por Género */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <h1 className="text-2xl sm:text-3xl font-black text-brand-secondary tracking-tight">
            {getGreeting()}
          </h1>

          {/* Filtros tipo pills para cambiar de vistas o géneros */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {GENRE_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer select-none shrink-0 ${
                  activeFilter === filter.id
                    ? 'bg-brand-primary text-white font-bold shadow-xs'
                    : 'bg-bg-surface border border-border-subtle/80 text-text-body hover:bg-bg-surface-active'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accesos rápidos (Estilo 6 cards de Spotify) */}
        {quickAccessItems.length > 0 && activeFilter === 'all' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
            {quickAccessItems.map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  if (e.target.closest('button[data-quick-play]')) return;
                  navigate(item.link);
                }}
                className="group flex items-center gap-3 bg-bg-surface border border-border-subtle/70 rounded-2xl overflow-hidden hover:bg-bg-surface-active hover:shadow-md transition-all select-none pr-3 cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = '/covers/un_verano_sin_ti.jpg';
                  }}
                  className="w-14 h-14 sm:w-16 sm:h-16 object-cover shrink-0"
                />
                <span className="font-bold text-xs sm:text-sm text-brand-secondary truncate flex-1 group-hover:text-brand-primary transition-colors">
                  {item.title}
                </span>
                <button
                  type="button"
                  data-quick-play="true"
                  onClick={(e) => handleQuickAccessPlay(e, item)}
                  onPointerDown={(e) => e.stopPropagation()}
                  aria-label={`Reproducir ${item.title}`}
                  className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all shrink-0 hover:scale-110 active:scale-95 cursor-pointer z-10"
                >
                  <Play size={14} fill="white" className="ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. ÁLBUMES DESTACADOS (O filtro pop/all) */}
      {(activeFilter === 'all' || activeFilter === 'pop') && albums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Disc size={20} className="text-brand-primary-dark" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
                Álbumes Destacados
              </h2>
            </div>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className={scrollGridClasses}>
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 3. ARTISTAS POPULARES (O filtro pop/all) */}
      {(activeFilter === 'all' || activeFilter === 'pop') && artists.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-brand-primary-dark" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
                Artistas Populares
              </h2>
            </div>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className={scrollGridClasses}>
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {/* 4. SECCIÓN ROCK */}
      {(activeFilter === 'all' || activeFilter === 'rock') && rockAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones size={20} className="text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
                Clásicos del Rock
              </h2>
            </div>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className={scrollGridClasses}>
            {rockAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SECCIÓN URBANO & REGGAETON */}
      {(activeFilter === 'all' || activeFilter === 'urban') && urbanAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={20} className="text-rose-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
                Éxitos Urbanos
              </h2>
            </div>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className={scrollGridClasses}>
            {urbanAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 6. SECCIÓN CHILL & LOFI */}
      {(activeFilter === 'all' || activeFilter === 'chill') && chillAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee size={20} className="text-emerald-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
                Chill & Relax
              </h2>
            </div>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className={scrollGridClasses}>
            {chillAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* 7. SECCIÓN ELECTRÓNICA & EDM */}
      {(activeFilter === 'all' || activeFilter === 'electronic') && electronicAlbums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-indigo-500" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
                Electrónica & EDM
              </h2>
            </div>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className={scrollGridClasses}>
            {electronicAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}