
import { SearchX, FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No hay nada por aquí',
  message = 'No encontramos elementos para mostrar.',
  query,
  action,
}) {
  return (
    <div className="p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-4 bg-bg-surface border border-border-subtle/60 rounded-3xl max-w-md mx-auto my-6 shadow-xs">
      <div className="w-14 h-14 rounded-full bg-bg-surface-active text-text-muted flex items-center justify-center">
        {query ? <SearchX size={28} /> : <FolderOpen size={28} />}
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-bold text-brand-secondary">
          {query ? `No encontramos resultados para "${query}"` : title}
        </h3>
        <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
          {query
            ? 'Revisá que las palabras estén bien escritas o probá con el nombre de otro artista, canción o género.'
            : message}
        </p>
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}