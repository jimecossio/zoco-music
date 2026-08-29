
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Algo salió mal',
  message = 'Ocurrió un error al cargar la información.',
  onRetry,
}) {
  return (
    <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center gap-4 bg-bg-surface border border-red-500/20 rounded-3xl max-w-lg mx-auto my-8 shadow-sm">
      <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shadow-xs">
        <AlertCircle size={28} />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-lg text-brand-secondary">{title}</h3>
        <p className="text-xs text-text-muted max-w-sm mx-auto">{message}</p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-xs bg-brand-primary-dark text-white font-semibold px-5 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} /> Reintentar conexión
        </button>
      )}
    </div>
  );
}