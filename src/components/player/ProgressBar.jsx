
import { usePlayer } from '../../context/PlayerContext';
import { formatDuration } from '../../utils/formatTime';

export default function ProgressBar({ durationMs = 30000, className = '' }) {
  const { progress, seekProgress } = usePlayer();

  return (
    <div className={`flex w-full items-center gap-3 text-xs text-text-muted font-mono select-none ${className}`}>
      <span className="w-9 text-right">{formatDuration(progress)}</span>
      <div className="relative flex-1 flex items-center">
        <input
          type="range"
          min="0"
          max={durationMs}
          value={progress}
          onChange={(e) => seekProgress(Number(e.target.value))}
          aria-label="Barra de progreso"
          className="w-full h-1.5 bg-border-subtle rounded-lg appearance-none cursor-pointer accent-brand-primary-dark focus:outline-none"
        />
      </div>
      <span className="w-9">{formatDuration(durationMs)}</span>
    </div>
  );
}
