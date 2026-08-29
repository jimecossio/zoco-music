
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Play, User, Flame } from 'lucide-react';
import { useSpotifyToken, getSpotifyToken } from '../hooks/useSpotifyToken';
import { getArtist, getArtistTracks, getArtistAlbums } from '../api/endpoints';
import TrackCard from '../components/cards/TrackCard';
import AlbumCard from '../components/cards/AlbumCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ErrorState from '../components/common/ErrorState';
import MockNoticeBanner from '../components/common/MockNoticeBanner';
import { usePlayer } from '../context/PlayerContext';
import { useFavorites } from '../context/FavoritesContext';

export default function ArtistDetail() {
  const { id } = useParams();
  const { token, loading: tokenLoading, error: tokenError } = useSpotifyToken();
  const { playTrack } = usePlayer();
  const { addToRecents } = useFavorites();

  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtistData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const activeToken = token || (await getSpotifyToken().catch(() => null));
      const artistData = await getArtist(id, activeToken);
      setArtist(artistData);

      const [tracksData, albumsData] = await Promise.allSettled([
        getArtistTracks(artistData.name, activeToken),
        getArtistAlbums(id, activeToken),
      ]);

      if (tracksData.status === 'fulfilled') {
        setTracks(tracksData.value?.tracks?.items || []);
      }
      if (albumsData.status === 'fulfilled') {
        setAlbums(albumsData.value?.items || []);
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Error al cargar los detalles del artista');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    if (tokenLoading) return;
    fetchArtistData();
  }, [tokenLoading, fetchArtistData]);

  const handlePlayArtist = () => {
    if (tracks.length === 0) return;
    playTrack(tracks[0], tracks);
    addToRecents(tracks[0]);
  };

  if (tokenLoading || (loading && !error && !tokenError)) {
    return (
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
        <LoadingSkeleton variant="header" />
        <div className="space-y-4">
          <div className="h-6 bg-border-subtle rounded w-40 animate-pulse" />
          <LoadingSkeleton count={5} variant="list" />
        </div>
      </div>
    );
  }

  if (tokenError || error || !artist) {
    return (
      <div className="p-6 md:p-8">
        <ErrorState
          title="Artista no encontrado"
          message={tokenError || error || 'No se pudo cargar la información del artista.'}
          onRetry={fetchArtistData}
        />
      </div>
    );
  }

  const artistImage =
    artist.images?.[0]?.url ||
    artist.images?.[1]?.url ||
    '/artists/bad_bunny.jpg';

  const followerCount = artist.followers?.total?.toLocaleString() || '0';

  return (
    <div className="p-6 md:p-8 space-y-10 max-w-7xl mx-auto">

      {artist._isMock && <MockNoticeBanner />}

      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-8 border-b border-border-subtle/80">
        <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden shadow-2xl bg-border-subtle shrink-0 border-4 border-bg-surface">
          {artistImage ? (
            <img
              src={artistImage}
              alt={artist.name}
              onError={(e) => {
                e.currentTarget.src = '/artists/bad_bunny.jpg';
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-muted">
              <User size={64} />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left space-y-3 flex-1 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary-dark">
              Artista Verificado
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-brand-secondary tracking-tight">
            {artist.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-text-muted">
            <span className="font-semibold text-brand-secondary">
              {followerCount} oyentes
            </span>

            {artist.genres?.length > 0 && (
              <span>• {artist.genres.slice(0, 3).join(', ')}</span>
            )}
          </div>

          {tracks.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePlayArtist}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-primary text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer text-sm"
              >
                <Play size={18} fill="white" className="ml-0.5" />
                Reproducir Canciones Populares
              </button>
            </div>
          )}
        </div>
      </div>

      {tracks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-rose-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
              Canciones Populares
            </h2>
          </div>

          <div className="bg-bg-surface border border-border-subtle/70 rounded-3xl p-3 sm:p-4 divide-y divide-border-subtle/40 shadow-xs">
            {tracks.map((track, idx) => (
              <TrackCard
                key={track.id || idx}
                track={track}
                trackList={tracks}
                index={idx}
              />
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-secondary">
              Discografía
            </h2>
            <span className="xl:hidden text-xs text-text-muted font-medium">Deslizar →</span>
          </div>

          <div className="flex overflow-x-auto xl:grid xl:grid-cols-6 gap-3.5 sm:gap-4 pb-2.5 xl:pb-0 no-scrollbar snap-x snap-mandatory scroll-smooth">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}