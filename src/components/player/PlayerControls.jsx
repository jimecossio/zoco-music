
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1 } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';

export default function PlayerControls({ className = '' }) {
  const {
    isPlaying,
    isShuffled,
    repeatMode,
    togglePlay,
    handleNext,
    handlePrevious,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  return (
    <div className={`flex items-center gap-3 sm:gap-5 ${className}`}>
      <button
        type="button"
        onClick={toggleShuffle}
        title={isShuffled ? 'Desactivar aleatorio' : 'Activar aleatorio'}
        aria-label="Aleatorio"
        className={`hidden sm:block p-1 rounded-full transition-colors ${
          isShuffled
            ? 'text-brand-primary-dark font-bold'
            : 'text-text-muted hover:text-brand-secondary'
        }`}
      >
        <Shuffle size={16} />
      </button>

      <button
        type="button"
        onClick={handlePrevious}
        aria-label="Canción anterior"
        className="text-text-muted hover:text-brand-secondary transition-transform active:scale-95 cursor-pointer"
      >
        <SkipBack size={20} />
      </button>

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-brand-primary-dark text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
      >
        {isPlaying ? (
          <Pause size={18} />
        ) : (
          <Play size={18} fill="white" className="ml-0.5" />
        )}
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Siguiente canción"
        className="text-text-muted hover:text-brand-secondary transition-transform active:scale-95 cursor-pointer"
      >
        <SkipForward size={20} />
      </button>

      <button
        type="button"
        onClick={toggleRepeat}
        title={`Repetición: ${repeatMode}`}
        aria-label="Modo de repetición"
        className={`hidden sm:block p-1 rounded-full transition-colors ${
          repeatMode !== 'off'
            ? 'text-brand-primary-dark font-bold'
            : 'text-text-muted hover:text-brand-secondary'
        }`}
      >
        {repeatMode === 'track' ? <Repeat1 size={17} /> : <Repeat size={17} />}
      </button>
    </div>
  );
}
