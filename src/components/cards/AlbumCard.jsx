// src/components/cards/AlbumCard.jsx
import { useNavigate } from 'react-router-dom';
import { Play, Disc } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { getSpotifyToken } from '../../api/spotifyClient';
import { getAlbum } from '../../api/endpoints';
import { useFavorites } from '../../context/FavoritesContext';

export default function AlbumCard({ album }) {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const { addToRecents } = useFavorites();

  if (!album) return null;

  const imageUrl =
    album.images?.[0]?.url ||
    album.images?.[1]?.url ||
    '/covers/un_verano_sin_ti.jpg';

  const artistNames =
    album.artists?.map((a) => a.name).join(', ') || 'Varios artistas';

  const releaseYear = album.release_date ? album.release_date.slice(0, 4) : '';

  async function handleQuickPlay(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      // 1. Si el objeto álbum ya incluye sus pistas
      if (album.tracks?.items?.length) {
        const fullTracks = album.tracks.items.map((t) => ({
          ...t,
          album: { images: album.images, name: album.name, id: album.id },
        }));
        playTrack(fullTracks[0], fullTracks);
        addToRecents(fullTracks[0]);
        return;
      }

      // 2. Si no las tiene, las obtenemos con getAlbum
      const token = await getSpotifyToken().catch(() => null);
      const albumData = await getAlbum(album.id, token);

      if (albumData?.tracks?.items?.length) {
        const fullTracks = albumData.tracks.items.map((t) => ({
          ...t,
          album: { images: albumData.images, name: albumData.name, id: albumData.id },
        }));
        playTrack(fullTracks[0], fullTracks);
        addToRecents(fullTracks[0]);
      } else {
        // Fallback: reproducir como pista con datos del álbum
        const fallbackTrack = {
          id: album.id + '_tr',
          name: album.name,
          duration_ms: 180000,
          artists: album.artists || [{ name: artistNames }],
          album: { images: album.images, name: album.name, id: album.id },
        };
        playTrack(fallbackTrack, [fallbackTrack]);
        addToRecents(fallbackTrack);
      }
    } catch (err) {
      console.warn('Error al reproducir álbum rápido:', err);
      const fallbackTrack = {
        id: album.id + '_tr',
        name: album.name,
        duration_ms: 180000,
        artists: album.artists || [{ name: artistNames }],
        album: { images: album.images, name: album.name, id: album.id },
      };
      playTrack(fallbackTrack, [fallbackTrack]);
      addToRecents(fallbackTrack);
    }
  }

  const handleCardClick = (e) => {
    if (e?.target?.closest('button[data-quick-play]')) {
      return;
    }
    navigate(`/album/${album.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group w-36 sm:w-40 md:w-44 xl:w-auto shrink-0 snap-start bg-bg-surface border border-border-subtle/70 p-3 sm:p-3.5 rounded-2xl hover:bg-bg-surface-active hover:shadow-md transition-all flex flex-col justify-between select-none cursor-pointer"
    >
      <div>
        <div className="relative mb-2.5 sm:mb-3 overflow-hidden rounded-xl bg-border-subtle aspect-square flex items-center justify-center shadow-xs">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={album.name}
              onError={(e) => {
                e.currentTarget.src = '/covers/un_verano_sin_ti.jpg';
              }}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <Disc size={36} className="text-text-muted" />
          )}

          {/* Botón flotante de reproducción rápida (Solo visible al pasar el mouse) */}
          <button
            type="button"
            data-quick-play="true"
            onClick={handleQuickPlay}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={`Reproducir álbum ${album.name}`}
            className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 hover:scale-110 active:scale-95 cursor-pointer z-10"
          >
            <Play size={18} fill="white" className="ml-0.5" />
          </button>
        </div>

        <h3 className="font-bold text-sm text-brand-secondary truncate group-hover:text-brand-primary transition-colors">
          {album.name}
        </h3>

        <p className="text-xs text-text-muted truncate mt-0.5 font-medium">
          {releaseYear && <span>{releaseYear} • </span>}
          {artistNames}
        </p>
      </div>
    </div>
  );
}