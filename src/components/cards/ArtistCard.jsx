
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function ArtistCard({ artist }) {
  if (!artist) return null;

  const image =
    artist.images?.[0]?.url ||
    artist.images?.[1]?.url ||
    '';

  return (
    <Link
      to={`/artist/${artist.id}`}
      className="group w-32 sm:w-36 md:w-40 xl:w-auto shrink-0 snap-start flex flex-col items-center text-center p-3 sm:p-4 bg-bg-surface border border-border-subtle/70 rounded-2xl hover:bg-bg-surface-active hover:shadow-md transition-all select-none"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-2.5 sm:mb-3 rounded-full overflow-hidden bg-border-subtle flex items-center justify-center shadow-xs">
        {image ? (
          <img
            src={image}
            alt={artist.name}
            className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <User size={36} className="text-text-muted" />
        )}
      </div>

      <h3 className="font-bold text-xs sm:text-sm text-brand-secondary truncate w-full group-hover:text-brand-primary-dark transition-colors">
        {artist.name}
      </h3>

      <span className="text-[11px] sm:text-xs text-text-muted mt-0.5 capitalize truncate w-full">
        {artist.genres?.length > 0 ? artist.genres[0] : 'Artista'}
      </span>
    </Link>
  );
}