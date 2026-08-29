// src/context/PlayerContext.jsx
import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolumeState] = useState(() => {
    const saved = localStorage.getItem('zoco_volume');
    return saved !== null ? Number(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'track'
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const queueRef = useRef([]);
  const currentIndexRef = useRef(0);
  const repeatModeRef = useRef(repeatMode);
  const isShuffledRef = useRef(isShuffled);
  const handleNextRef = useRef(null);
  const startSimulationTimerRef = useRef(null);

  // Sincronizar referencias para callbacks y timers
  useEffect(() => {
    queueRef.current = queue;
    currentIndexRef.current = currentIndex;
    repeatModeRef.current = repeatMode;
    isShuffledRef.current = isShuffled;
  }, [queue, currentIndex, repeatMode, isShuffled]);

  const seekProgress = useCallback((newProgressMs) => {
    setProgress(newProgressMs);
    if (audioRef.current && currentTrack?.preview_url) {
      audioRef.current.currentTime = newProgressMs / 1000;
    }
  }, [currentTrack]);

  const handleNext = useCallback((forceNext = false) => {
    const q = queueRef.current;
    if (q.length === 0) return;

    // Si terminó automáticamente (no forzado manualmente) y está en modo 'track', reiniciar la misma canción
    if (!forceNext && repeatModeRef.current === 'track') {
      seekProgress(0);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    let nextIdx;
    if (isShuffledRef.current && q.length > 1) {
      do {
        nextIdx = Math.floor(Math.random() * q.length);
      } while (nextIdx === currentIndexRef.current && q.length > 1);
    } else {
      nextIdx = currentIndexRef.current + 1;
      if (nextIdx >= q.length) {
        if (repeatModeRef.current === 'all' || repeatModeRef.current === 'track') {
          nextIdx = 0; // Volver al inicio de la lista
        } else {
          setIsPlaying(false);
          setProgress(0);
          return;
        }
      }
    }

    setCurrentIndex(nextIdx);
    setCurrentTrack(q[nextIdx]);
    setProgress(0);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [seekProgress]);

  const handlePrevious = useCallback(() => {
    const q = queueRef.current;
    if (q.length === 0) return;

    // Si la cola tiene un solo track, reiniciar a 0
    if (q.length === 1) {
      seekProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      setIsPlaying(true);
      return;
    }

    // Si la canción lleva más de 3 segundos de reproducción, reiniciar al inicio
    if (progress > 3000) {
      seekProgress(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }

    // Si está en modo aleatorio
    let prevIdx;
    if (isShuffledRef.current && q.length > 1) {
      do {
        prevIdx = Math.floor(Math.random() * q.length);
      } while (prevIdx === currentIndexRef.current && q.length > 1);
    } else {
      prevIdx = (currentIndexRef.current - 1 + q.length) % q.length;
    }

    setCurrentIndex(prevIdx);
    setCurrentTrack(q[prevIdx]);
    setProgress(0);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [progress, seekProgress]);

  const startSimulationTimer = useCallback(() => {
    clearInterval(timerRef.current);
    const duration = currentTrack?.duration_ms || 30000;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= duration) {
          if (repeatModeRef.current === 'track') {
            return 0;
          }
          if (handleNextRef.current) {
            handleNextRef.current(false);
          }
          return 0;
        }
        return prev + 1000;
      });
    }, 1000);
  }, [currentTrack]);

  useEffect(() => {
    handleNextRef.current = handleNext;
    startSimulationTimerRef.current = startSimulationTimer;
  }, [handleNext, startSimulationTimer]);

  // Inicializar elemento de audio HTML5
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress(Math.floor(audio.currentTime * 1000));
      }
    };

    const handleEnded = () => {
      if (repeatModeRef.current === 'track') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setProgress(0);
      } else if (handleNextRef.current) {
        handleNextRef.current(false);
      }
    };

    const handleError = () => {
      console.warn('Audio preview no disponible, usando simulación de reproducción');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar audio.loop nativo con el modo repeat
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = (repeatMode === 'track');
    }
  }, [repeatMode]);

  // Actualizar volumen del audio nativo
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    localStorage.setItem('zoco_volume', volume.toString());
  }, [volume, isMuted]);

  // Manejo de reproducción / simulación cuando no hay preview_url
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentTrack) {
      if (audio) audio.pause();
      clearInterval(timerRef.current);
      return;
    }

    const hasPreview = Boolean(currentTrack.preview_url);

    if (isPlaying) {
      if (hasPreview && audio) {
        if (audio.src !== currentTrack.preview_url) {
          audio.src = currentTrack.preview_url;
        }
        audio.play().catch(() => {
          if (startSimulationTimerRef.current) {
            startSimulationTimerRef.current();
          }
        });
      } else {
        if (startSimulationTimerRef.current) {
          startSimulationTimerRef.current();
        }
      }
    } else {
      if (audio) audio.pause();
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack]);

  function playTrack(track, trackList = []) {
    if (!track) return;
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);

    if (trackList.length > 0) {
      setQueue(trackList);
      const index = trackList.findIndex((t) => t.id === track.id);
      setCurrentIndex(index !== -1 ? index : 0);
    } else {
      setQueue([track]);
      setCurrentIndex(0);
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }

  function togglePlay() {
    if (!currentTrack) return;
    setIsPlaying((prev) => !prev);
  }

  function setVolume(newVol) {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }

  function toggleMute() {
    setIsMuted((prev) => !prev);
  }

  function toggleShuffle() {
    setIsShuffled((prev) => !prev);
  }

  function toggleRepeat() {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'track';
      return 'off';
    });
  }

  function toggleSidePanel() {
    setIsSidePanelOpen((prev) => !prev);
  }

  function openSidePanel() {
    setIsSidePanelOpen(true);
  }

  function closeSidePanel() {
    setIsSidePanelOpen(false);
  }

  return (
    <PlayerContext.Provider
      value={{
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
        playTrack,
        togglePlay,
        handleNext: () => handleNext(true),
        handlePrevious,
        seekProgress,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        toggleSidePanel,
        openSidePanel,
        closeSidePanel,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer debe ser usado dentro de un PlayerProvider');
  }
  return context;
};