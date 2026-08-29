// src/components/player/Player.jsx
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Shuffle,
  Repeat,
  Repeat1,
  Music2,
  PanelRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../../context/PlayerContext';
import { useFavorites } from '../../context/FavoritesContext';
import { formatDuration } from '../../utils/formatTime';

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    progress,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    isSidePanelOpen,
    togglePlay,
    handleNext,
    handlePrevious,
    seekProgress,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleSidePanel,
  } = usePlayer();

  const { isFavorite, toggleFavorite } = useFavorites();

  // Si no hay canción o si la ventana de detalle lateral está abierta, cerramos la barra inferior
  if (!currentTrack || isSidePanelOpen) return null;

  const trackCover =
    currentTrack.album?.images?.[0]?.url ||
    currentTrack.album?.images?.[1]?.url ||
    '';

  const artistNames =
    currentTrack.artists?.map((a) => a.name).join(', ') || 'Artista';

  const primaryArtist = currentTrack.artists?.[0];
  const durationMs = currentTrack.duration_ms || 30000;
  const progressPercent = Math.min((progress / durationMs) * 100, 100);
  const favorite = isFavorite(currentTrack.id);

  const VolumeIcon = isMuted || volume === 0 
    ? VolumeX 
    : volume < 0.5 
    ? Volume1 
    : Volume2;

  return (
    <footer
      className="fixed bottom-16 md:bottom-0 left-0 right-0 h-16 md:h-24 bg-bg-surface/95 backdrop-blur-xl border-t border-border-subtle px-3.5 sm:px-4 md:px-6 flex items-center justify-between z-40 shadow-2xl transition-all duration-300"
    >
      {/* Barra de progreso superior interactiva en mobile */}
      <div
        onClick={toggleSidePanel}
        className="absolute top-0 left-0 right-0 h-1 bg-border-subtle md:hidden cursor-pointer"
      >
        <div
          className="h-full bg-brand-primary transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ========================================================
          VISTA MÓVIL (Limpia y minimalista: Info + Favorito + Play/Pause)
         ======================================================== */}
      <div className="flex md:hidden items-center justify-between w-full gap-3 min-w-0">
        {/* Info de la pista (Toca para abrir en pantalla completa) */}
        <div
          onClick={toggleSidePanel}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer select-none"
        >
          {trackCover ? (
            <img
              src={trackCover}
              alt={currentTrack.name}
              className="w-10 h-10 rounded-lg object-cover shadow-xs shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-border-subtle flex items-center justify-center shrink-0">
              <Music2 size={16} className="text-text-muted" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-brand-secondary truncate">
              {currentTrack.name}
            </p>
            <p className="text-[10px] text-text-muted truncate">
              {artistNames}
            </p>
          </div>
        </div>

        {/* Controles en móvil: Favorito + Play/Pause grande */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => toggleFavorite(currentTrack)}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="p-2 text-text-muted hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Heart
              size={19}
              className={favorite ? 'fill-rose-500 text-rose-500' : ''}
            />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            {isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} fill="white" className="ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          VISTA ESCRITORIO (3 Columnas completas)
         ======================================================== */}
      <div className="hidden md:flex items-center justify-between w-full">
        {/* 1. INFORMACIÓN DE LA CANCIÓN */}
        <div className="flex items-center gap-3 w-1/4 min-w-0">
          <div
            onClick={toggleSidePanel}
            title="Ver detalle en grande"
            className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer group select-none"
          >
            {trackCover ? (
              <div className="relative shrink-0">
                <img
                  src={trackCover}
                  alt={currentTrack.name}
                  className="w-14 h-14 rounded-xl object-cover shadow-sm border border-border-subtle/50 group-hover:opacity-90 group-hover:scale-105 transition-all"
                />
                <div className="absolute inset-0 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <PanelRight size={16} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-xl bg-border-subtle flex items-center justify-center shrink-0">
                <Music2 size={20} className="text-text-muted" />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-brand-secondary truncate group-hover:text-brand-primary transition-colors">
                {currentTrack.name}
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

          <button
            type="button"
            onClick={() => toggleFavorite(currentTrack)}
            aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="shrink-0 p-1.5 text-text-muted hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Heart
              size={18}
              className={favorite ? 'fill-rose-500 text-rose-500' : ''}
            />
          </button>
        </div>

        {/* 2. CONTROLES PRINCIPALES Y BARRA DE PROGRESO */}
        <div className="flex flex-col items-center justify-center gap-2 w-2/4 max-w-xl">
          <div className="flex items-center gap-5">
            {/* Shuffle */}
            <button
              type="button"
              onClick={toggleShuffle}
              title={isShuffled ? 'Aleatorio activado' : 'Activar aleatorio'}
              aria-label="Aleatorio"
              className={`p-2 rounded-full transition-all cursor-pointer relative ${
                isShuffled
                  ? 'text-brand-primary-dark bg-brand-primary/25 font-bold shadow-2xs'
                  : 'text-text-muted hover:text-brand-secondary hover:bg-bg-surface-active'
              }`}
            >
              <Shuffle size={17} />
              {isShuffled && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-primary" />
              )}
            </button>

            {/* Anterior */}
            <button
              type="button"
              onClick={handlePrevious}
              title="Canción anterior"
              aria-label="Canción anterior"
              className="p-1.5 text-text-muted hover:text-brand-secondary hover:bg-bg-surface-active rounded-full transition-all active:scale-90 cursor-pointer"
            >
              <SkipBack size={20} />
            </button>

            {/* Play / Pause */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              className="w-11 h-11 rounded-full bg-brand-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              {isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} fill="white" className="ml-0.5" />
              )}
            </button>

            {/* Siguiente */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Siguiente canción"
              className="text-text-muted hover:text-brand-secondary transition-transform active:scale-95 cursor-pointer"
            >
              <SkipForward size={20} />
            </button>

            {/* Repeat */}
            <button
              type="button"
              onClick={toggleRepeat}
              title={`Repetición: ${repeatMode}`}
              aria-label="Modo de repetición"
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-brand-primary-dark font-bold bg-brand-primary/20'
                  : 'text-text-muted hover:text-brand-secondary'
              }`}
            >
              {repeatMode === 'track' ? <Repeat1 size={17} /> : <Repeat size={17} />}
            </button>
          </div>

          <div className="flex w-full items-center gap-3 text-xs text-text-muted font-mono select-none">
            <span className="w-9 text-right">{formatDuration(progress)}</span>
            <div className="relative flex-1 flex items-center group">
              <input
                type="range"
                min="0"
                max={durationMs}
                value={progress}
                onChange={(e) => seekProgress(Number(e.target.value))}
                aria-label="Barra de progreso de reproducción"
                className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
              />
            </div>
            <span className="w-9">{formatDuration(durationMs)}</span>
          </div>
        </div>

        {/* 3. CONTROL DE VOLUMEN Y BOTÓN DE PANEL LATERAL */}
        <div className="flex w-1/4 justify-end items-center gap-3 text-text-muted">
          <button
            type="button"
            onClick={toggleSidePanel}
            title={isSidePanelOpen ? 'Ocultar panel lateral' : 'Ver detalle en grande'}
            aria-label="Panel lateral de reproducción"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isSidePanelOpen
                ? 'text-brand-primary-dark bg-brand-primary/20 font-bold'
                : 'hover:text-brand-secondary hover:bg-bg-surface-active'
            }`}
          >
            <PanelRight size={19} />
          </button>

          <div className="h-4 w-px bg-border-subtle mx-1" />

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="hover:text-brand-secondary transition-colors cursor-pointer"
          >
            <VolumeIcon size={19} />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Control de volumen"
            className="w-24 h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary focus:outline-none"
          />
        </div>
      </div>
    </footer>
  );
}