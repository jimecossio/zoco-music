// src/pages/AlbumDetail.jsx
import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Disc, Clock, Calendar, Music } from 'lucide-react';
import { useSpotifyToken, getSpotifyToken } from '../hooks/useSpotifyToken';
import { getAlbum } from '../api/endpoints';
import TrackCard from '../components/cards/TrackCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import MockNoticeBanner from '../components/common/MockNoticeBanner';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';

export default function AlbumDetail() {
  const { id } = useParams();
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken();
  const { playTrack } = usePlayer();
  const { addToRecents } = useFavorites();

  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlbumData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const activeToken = token || (await getSpotifyToken().catch(() => null));
      const data = await getAlbum(id, activeToken);
      setAlbum(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar el álbum');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (tokenLoading) return;
    fetchAlbumData();
  }, [tokenLoading, fetchAlbumData]);

  const handlePlayAlbum = () => {
    if (!album || !album.tracks?.items?.length) return;
    const fullTracks = album.tracks.items.map((t) => ({
      ...t,
      album: {
        images: album.images,
        name: album.name,
        id: album.id,
      },
    }));
    playTrack(fullTracks[0], fullTracks);
    addToRecents(fullTracks[0]);
  };

  if (tokenLoading || (loading && !error && !tokenError)) {
    return (
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        <LoadingSkeleton variant="header" />
        <div className="space-y-4">
          <div className="h-6 bg-border-subtle rounded w-40 animate-pulse" />
          <LoadingSkeleton count={8} variant="list" />
        </div>
      </div>
    );
  }

  if (tokenError || error || !album) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState
          title="Álbum no encontrado"
          message={tokenError || error || 'No se pudo cargar la información del álbum.'}
          onRetry={fetchAlbumData}
        />
      </div>
    );
  }

  const albumImage =
    album.images?.[0]?.url ||
    album.images?.[1]?.url ||
    '/covers/un_verano_sin_ti.jpg';

  const fullTracks = (album.tracks?.items || []).map((t) => ({
    ...t,
    album: {
      images: album.images,
      name: album.name,
      id: album.id,
    },
  }));

  const releaseYear = album.release_date ? album.release_date.slice(0, 4) : '';

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">
      {/* Aviso de contingencia si se muestran datos mock */}
      {album._isMock && <MockNoticeBanner />}

      {/* 1. HEADER DEL ÁLBUM */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-border-subtle/80">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl bg-border-subtle shrink-0">
          {albumImage ? (
            <img
              src={albumImage}
              alt={album.name}
              onError={(e) => {
                e.currentTarget.src = '/covers/un_verano_sin_ti.jpg';
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <Disc size={64} />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary-dark">
            {album.album_type === 'single' ? 'Sencillo / EP' : 'Álbum'}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-brand-secondary tracking-tight">
            {album.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-text-muted">
            {album.artists?.map((artist, idx) => (
              <span key={artist.id || idx}>
                {artist.id ? (
                  <Link
                    to={`/artist/${artist.id}`}
                    className="font-bold text-brand-secondary hover:underline hover:text-brand-primary-dark transition-colors"
                  >
                    {artist.name}
                  </Link>
                ) : (
                  <span className="font-bold text-brand-secondary">{artist.name}</span>
                )}
                {idx < album.artists.length - 1 && ', '}
              </span>
            ))}

            {releaseYear && (
              <span className="flex items-center gap-1">
                • <Calendar size={13} /> {releaseYear}
              </span>
            )}

            <span>
              • <Music size={13} className="inline mr-0.5" /> {album.total_tracks || fullTracks.length} canciones
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handlePlayAlbum}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer text-sm"
            >
              <Play size={18} fill="white" className="ml-0.5" />
              Reproducir Álbum
            </button>
          </div>
        </div>
      </div>

      {/* 2. LISTA DE CANCIONES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-text-muted font-bold uppercase tracking-wider px-4">
          <div className="flex items-center gap-3">
            <span className="w-6 text-center">#</span>
            <span>Título</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={14} />
          </div>
        </div>

        <div className="bg-bg-surface border border-border-subtle/70 rounded-3xl p-3 sm:p-4 divide-y divide-border-subtle/40 shadow-xs">
          {fullTracks.map((track, idx) => (
            <TrackCard
              key={track.id || idx}
              track={track}
              trackList={fullTracks}
              index={idx}
              showCover={false}
            />
          ))}
        </div>
      </section>
    </div>
  );
}