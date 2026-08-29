
import { createContext, useContext, useEffect, useState } from 'react';
import { getStorage, setStorage } from '../utils/storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => getStorage('zoco_favorites', []));
  const [recents, setRecents] = useState(() => getStorage('zoco_recents', []));

  useEffect(() => {
    setStorage('zoco_favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    setStorage('zoco_recents', recents);
  }, [recents]);

  function toggleFavorite(track) {
    if (!track?.id) return;
    setFavorites((prev) =>
      prev.some((t) => t.id === track.id)
        ? prev.filter((t) => t.id !== track.id)
        : [track, ...prev]
    );
  }

  function isFavorite(id) {
    if (!id) return false;
    return favorites.some((t) => t.id === id);
  }

  function addToRecents(track) {
    if (!track?.id) return;
    setRecents((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 30);
    });
  }

  function clearRecents() {
    setRecents([]);
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        recents,
        toggleFavorite,
        isFavorite,
        addToRecents,
        clearRecents,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};