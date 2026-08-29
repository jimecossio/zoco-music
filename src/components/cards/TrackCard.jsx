// src/components/cards/TrackCard.jsx
import { Play, Pause, Heart, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatDuration } from '../../utils/formatTime';

export default function TrackCard({
  track,
  trackList = [],
  index,
  showCover = true,
  showAlbum = false,
}) {
  const { playTrack, togglePlay, currentTrack, isPlaying } = usePlayer();
  const { toggleFavorite, isFavorite, addToRecents } = useFavorites();

  if (!track) return null;

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrentTrack && isPlaying;
  const favorite = isFavorite(track.id);

  const coverUrl =
    track.album?.images?.[2]?.url ||
    track.album?.images?.[0]?.url ||
    '';

  const artistNames =
    track.artists?.map((a) => a.name).join(', ') || 'Artista desconocido';

  const primaryArtist = track.artists?.[0];

  function handlePlay(e) {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      const fullList = trackList.length > 0 ? trackList : [track];
      playTrack(track, fullList);
      addToRecents(track);
    }
  }

  function handleFavorite(e) {
    e.stopPropagation();
    toggleFavorite(track);
  }

  return (
    <div
      onClick={handlePlay}
      className={`group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer select-none ${
        isCurrentTrack
          ? 'bg-brand-primary/15 border border-brand-primary/30 shadow-xs'
          : 'hover:bg-bg-surface-active border border-transparent'
      }`}
    >
      {/* Columna Izquierda: Índice / Play / Cover / Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Número o Botón Play */}
        <div className="w-7 flex items-center justify-center shrink-0 text-text-muted font-mono text-xs">
          {isCurrentPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-1 bg-brand-primary-dark rounded-full animate-bounce h-full" style={{ animationDelay: '0ms' }} />
              <span className="w-1 bg-brand-primary-dark rounded-full animate-bounce h-2/3" style={{ animationDelay: '150ms' }} />
              <span className="w-1 bg-brand-primary-dark rounded-full animate-bounce h-full" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              {index !== undefined ? (
                <span className="group-hover:hidden">{index + 1}</span>
              ) : null}
              <button
                type="button"
                onClick={handlePlay}
                aria-label={isCurrentPlaying ? 'Pausar' : 'Reproducir'}
                className={`${index !== undefined ? 'hidden group-hover:flex' : 'flex'} w-6 h-6 rounded-full items-center justify-center text-brand-secondary hover:text-brand-primary-dark hover:scale-110 transition-transform`}
              >
                {isCurrentPlaying ? (
                  <Pause size={14} className="fill-current" />
                ) : (
                  <Play size={14} className="fill-current ml-0.5" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Portada */}
        {showCover && (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-border-subtle flex items-center justify-center shadow-xs">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={track.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <Music2 size={18} className="text-text-muted" />
            )}
          </div>
        )}

        {/* Título y Artistas */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold truncate ${
              isCurrentTrack ? 'text-brand-primary-dark font-bold' : 'text-brand-secondary'
            }`}
          >
            {track.name}
          </p>
          <p className="text-xs text-text-muted truncate">
            {primaryArtist?.id ? (
              <Link
                to={`/artist/${primaryArtist.id}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:underline hover:text-brand-secondary transition-colors"
              >
                {artistNames}
              </Link>
            ) : (
              artistNames
            )}
          </p>
        </div>
      </div>

      {/* Columna Centro/Derecha: Álbum (opcional) */}
      {showAlbum && track.album && (
        <div className="hidden md:block flex-1 min-w-0 px-2">
          {track.album.id ? (
            <Link
              to={`/album/${track.album.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-text-muted hover:underline hover:text-brand-secondary truncate block"
            >
              {track.album.name}
            </Link>
          ) : (
            <span className="text-xs text-text-muted truncate block">{track.album.name}</span>
          )}
        </div>
      )}

      {/* Columna Derecha: Favorito y Duración */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`p-1.5 rounded-full transition-transform active:scale-90 ${
            favorite
              ? 'text-rose-500 hover:text-rose-600'
              : 'text-text-muted/50 hover:text-rose-500 opacity-70 group-hover:opacity-100'
          }`}
        >
          <Heart
            size={17}
            className={favorite ? 'fill-rose-500 text-rose-500' : ''}
          />
        </button>

        <span className="text-xs text-text-muted font-mono w-10 text-right">
          {formatDuration(track.duration_ms)}
        </span>
      </div>
    </div>
  );
}