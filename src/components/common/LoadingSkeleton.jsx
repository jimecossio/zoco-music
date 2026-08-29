
export default function LoadingSkeleton({ count = 6, variant = 'grid' }) {
  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 p-2.5 bg-bg-surface/60 border border-border-subtle/40 rounded-xl animate-pulse"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-6 h-4 bg-border-subtle rounded shrink-0" />
              <div className="w-10 h-10 bg-border-subtle rounded-lg shrink-0" />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="h-3.5 bg-border-subtle rounded w-2/5" />
                <div className="h-2.5 bg-border-subtle rounded w-1/4" />
              </div>
            </div>
            <div className="w-8 h-3 bg-border-subtle rounded shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="bg-bg-surface border border-border-subtle/60 p-4 rounded-2xl animate-pulse flex flex-col items-center space-y-3"
          >
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-border-subtle" />
            <div className="h-4 bg-border-subtle rounded w-3/4" />
            <div className="h-3 bg-border-subtle rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 pb-6 border-b border-border-subtle animate-pulse">
        <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-border-subtle shrink-0" />
        <div className="space-y-3 text-center sm:text-left flex-1 w-full">
          <div className="h-3 bg-border-subtle rounded w-16 mx-auto sm:mx-0" />
          <div className="h-8 sm:h-10 bg-border-subtle rounded w-3/4 mx-auto sm:mx-0" />
          <div className="h-4 bg-border-subtle rounded w-1/2 mx-auto sm:mx-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-bg-surface border border-border-subtle/60 p-3.5 rounded-2xl animate-pulse space-y-3"
        >
          <div className="w-full aspect-square bg-border-subtle rounded-xl" />
          <div className="h-4 bg-border-subtle rounded w-4/5" />
          <div className="h-3 bg-border-subtle rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}