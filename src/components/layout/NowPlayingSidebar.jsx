
import {
  X,
  ChevronDown,
  Heart,
  Music2,
  Disc,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatDuration } from '../../utils/formatTime';

export default function NowPlayingSidebar() {
  const {
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    progress,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    isSidePanelOpen,
    closeSidePanel,
    playTrack,
    togglePlay,
    handleNext,
    handlePrevious,
    seekProgress,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const { isFavorite, toggleFavorite, addToRecents } = useFavorites();

  if (!isSidePanelOpen || !currentTrack) return null;

  const trackCover =
    currentTrack.album?.images?.[0]?.url ||
    currentTrack.album?.images?.[1]?.url ||
    '';

  const artistNames =
    currentTrack.artists?.map((a) => a.name).join(', ') || 'Artista desconocido';

  const primaryArtist = currentTrack.artists?.[0];
  const albumName = currentTrack.album?.name || 'Álbum';
  const albumId = currentTrack.album?.id;
  const favorite = isFavorite(currentTrack.id);
  const durationMs = currentTrack.duration_ms || 30000;

  const nextTrack = queue[currentIndex + 1];

  const VolumeIcon = isMuted || volume === 0
    ? VolumeX
    : volume < 0.5
    ? Volume1
    : Volume2;

  return (
    <aside
      className="fixed inset-0 z-50 bg-bg-base overflow-y-auto p-6 md:p-6 flex flex-col justify-between md:static md:w-80 md:lg:w-96 md:bg-bg-surface md:border-l md:border-border-subtle md:shrink-0 md:h-screen md:pb-6 shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom md:slide-in-from-right"
    >
      <div className="space-y-5 max-w-md mx-auto w-full md:max-w-none">

        <div className="flex items-center justify-between pb-3 border-b border-border-subtle/80">

          <button
            type="button"
            onClick={closeSidePanel}
            aria-label="Minimizar reproductor"
            className="md:hidden p-2 rounded-full text-brand-secondary hover:bg-bg-surface transition-colors cursor-pointer"
          >
            <ChevronDown size={24} />
          </button>

          <div className="flex items-center gap-2 text-center md:text-left">
            <Disc size={18} className="text-brand-primary" />
            <span className="text-xs md:text-sm font-bold text-brand-secondary">
              Reproduciendo ahora
            </span>
          </div>

          <button
            type="button"
            onClick={closeSidePanel}
            aria-label="Cerrar panel de detalle"
            className="hidden md:flex p-1.5 rounded-full text-text-muted hover:text-brand-secondary hover:bg-bg-surface-active transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>

          <div className="w-8 md:hidden shrink-0" aria-hidden="true" />
        </div>

        <div className="relative aspect-square w-full max-w-xs sm:max-w-sm md:max-w-none mx-auto rounded-3xl md:rounded-2xl overflow-hidden shadow-xl bg-border-subtle flex items-center justify-center group">
          {trackCover ? (
            <img
              src={trackCover}
              alt={currentTrack.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
          ) : (
            <Music2 size={80} className="text-text-muted" />
          )}

          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {currentTrack.preview_url ? 'Preview HQ' : 'Streaming'}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-black text-brand-secondary tracking-tight truncate">
                {currentTrack.name}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted font-medium truncate mt-0.5">
                {primaryArtist?.id ? (
                  <Link
                    to={`/artist/${primaryArtist.id}`}
                    onClick={closeSidePanel}
                    className="hover:underline hover:text-brand-primary transition-colors"
                  >
                    {artistNames}
                  </Link>
                ) : (
                  artistNames
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => toggleFavorite(currentTrack)}
              aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className="p-2.5 rounded-full text-text-muted hover:text-rose-500 hover:bg-bg-surface-active transition-all cursor-pointer shrink-0"
            >
              <Heart
                size={22}
                className={favorite ? 'fill-rose-500 text-rose-500' : ''}
              />
            </button>
          </div>

          <div className="space-y-1 pt-1">
            <input
              type="range"
              min="0"
              max={durationMs}
              value={progress}
              onChange={(e) => seekProgress(Number(e.target.value))}
              aria-label="Barra de progreso"
              className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
            />
            <div className="flex justify-between text-xs md:text-[11px] font-mono text-text-muted">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(durationMs)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-2 py-1">

          <button
            type="button"
            onClick={toggleShuffle}
            title={isShuffled ? 'Aleatorio activado' : 'Activar aleatorio'}
            aria-label="Aleatorio"
            className={`p-2 rounded-full transition-all cursor-pointer relative ${
              isShuffled ? 'text-brand-primary-dark bg-brand-primary/25 font-bold shadow-2xs' : 'text-text-muted hover:bg-bg-surface-active'
            }`}
          >
            <Shuffle size={18} />
            {isShuffled && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={handlePrevious}
            title="Canción anterior"
            aria-label="Canción anterior"
            className="p-2 text-text-body hover:text-brand-secondary transition-transform active:scale-90 cursor-pointer"
          >
            <SkipBack size={22} />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className="w-12 h-12 md:w-13 md:h-13 rounded-full bg-brand-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} fill="white" className="ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            title="Siguiente canción"
            aria-label="Siguiente canción"
            className="p-2 text-text-body hover:text-brand-secondary transition-transform active:scale-90 cursor-pointer"
          >
            <SkipForward size={22} />
          </button>

          <button
            type="button"
            onClick={toggleRepeat}
            title={
              repeatMode === 'track'
                ? 'Repetir canción actual (1)'
                : repeatMode === 'all'
                ? 'Repetir toda la lista'
                : 'Activar repetición'
            }
            aria-label="Repetición"
            className={`p-2 rounded-full transition-all cursor-pointer relative ${
              repeatMode !== 'off'
                ? 'text-brand-primary-dark bg-brand-primary/25 font-bold shadow-2xs'
                : 'text-text-muted hover:bg-bg-surface-active'
            }`}
          >
            {repeatMode === 'track' ? <Repeat1 size={18} /> : <Repeat size={18} />}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2.5 px-2 py-1 text-text-muted bg-bg-surface-active/50 rounded-xl border border-border-subtle/50">
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="hover:text-brand-secondary cursor-pointer"
          >
            <VolumeIcon size={16} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volumen"
            className="flex-1 h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
          />
        </div>

        <div className="p-3 bg-bg-surface-active/60 border border-border-subtle/70 rounded-2xl space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Álbum
          </span>
          <div>
            {albumId ? (
              <Link
                to={`/album/${albumId}`}
                onClick={closeSidePanel}
                className="text-xs font-bold text-brand-secondary hover:underline hover:text-brand-primary truncate block transition-colors"
              >
                {albumName}
              </Link>
            ) : (
              <span className="text-xs font-bold text-brand-secondary truncate block">
                {albumName}
              </span>
            )}
          </div>
        </div>

        {nextTrack && (
          <div className="space-y-1.5 pt-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Siguiente en la cola
            </h4>
            <div
              onClick={() => {
                playTrack(nextTrack, queue);
                addToRecents(nextTrack);
              }}
              className="flex items-center justify-between gap-3 p-2.5 bg-bg-surface border border-border-subtle/80 rounded-2xl hover:bg-bg-surface-active transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={
                    nextTrack.album?.images?.[2]?.url ||
                    nextTrack.album?.images?.[0]?.url ||
                    ''
                  }
                  alt={nextTrack.name}
                  className="w-10 h-10 rounded-xl object-cover bg-border-subtle shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-brand-secondary truncate group-hover:text-brand-primary transition-colors">
                    {nextTrack.name}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {nextTrack.artists?.map((a) => a.name).join(', ')}
                  </p>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-brand-primary/30 text-brand-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Play size={12} fill="currentColor" className="ml-0.5" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 pb-1 text-center text-xs md:text-[10px] text-text-muted border-t border-border-subtle/50">
        Reproduciendo con ZOCO Music
      </div>
    </aside>
  );
}
