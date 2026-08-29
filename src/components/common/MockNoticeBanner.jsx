// src/components/common/MockNoticeBanner.jsx
import { Info } from 'lucide-react';

export default function MockNoticeBanner({
  message = 'Mostrando contenido de muestra — la API de Spotify no respondió en este momento.',
}) {
  return (
    <aside
      aria-label="Aviso de contenido de muestra"
      className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 dark:text-amber-200 text-xs font-medium shadow-2xs transition-all animate-fade-in mb-4"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
        <span className="leading-snug truncate sm:whitespace-normal">
          {message}
        </span>
      </div>

      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[10px] font-bold tracking-wide uppercase text-amber-700 dark:text-amber-300 shrink-0">
        Demo Mode
      </span>
    </aside>
  );
}
