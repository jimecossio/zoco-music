// src/api/endpoints.js
import { spotifyFetch } from './spotifyClient';

// IDs verificados y activos en Spotify (Exactamente 6 para simetría perfecta en grid de 6 columnas)
const FEATURED_ALBUM_IDS = [
  '3RQQmkQEvNCY4prGKE6oc5', // Un Verano Sin Ti - Bad Bunny
  '1NAmidJlEaVgA3MpcPFYGq', // Lover - Taylor Swift
  '4yP0hdKOZPNshxUOjY0cZj', // After Hours - The Weeknd
  '7aJuG4TFXa2hmE4z1yxc3n', // HIT ME HARD AND SOFT - Billie Eilish
  '6jbtHi5R0jMXoliU2OS0lo', // MOTOMAMI - ROSALÍA
  '1Mo92916G2mmG7ajpmSVrc', // Radical Optimism - Dua Lipa
];

const FEATURED_ARTIST_IDS = [
  '06HL4z0CvFAxyc27GXpf02', // Taylor Swift
  '4q3ewBCX7sLwd24euuV69X', // Bad Bunny
  '1Xyo4u8uXC1ZmMpatF05PJ', // The Weeknd
  '6qqNVTkY8uBg9cP3Jd7DAH', // Billie Eilish
  '6M2wZ9GZgrQXHCFfjv46we', // Dua Lipa (ID verificado 200 OK)
  '7ltDVBr6mKbRvohxheJ9h1', // ROSALÍA (ID verificado 200 OK)
];

// 1. Álbumes destacados para Home (Usa lote /albums?ids=... en una sola llamada)
export const getFeaturedAlbums = async (token) => {
  try {
    const data = await spotifyFetch(`/albums?ids=${FEATURED_ALBUM_IDS.join(',')}`, token);
    if (data?.albums?.length) {
      return data.albums
        .filter(Boolean)
        .map((a) => (data._isMock ? { ...a, _isMock: true } : a));
    }
  } catch (err) {
    console.warn('Fallo en lote de álbumes destacados, intentando individual:', err);
  }

  const results = await Promise.allSettled(
    FEATURED_ALBUM_IDS.map((id) => spotifyFetch(`/albums/${id}`, token))
  );

  return results
    .filter((res) => res.status === 'fulfilled' && res.value?.id)
    .map((res) => res.value);
};

// 2. Artistas destacados para Home (Usa lote /artists?ids=... en una sola llamada)
export const getFeaturedArtists = async (token) => {
  try {
    const data = await spotifyFetch(`/artists?ids=${FEATURED_ARTIST_IDS.join(',')}`, token);
    if (data?.artists?.length) {
      return data.artists
        .filter(Boolean)
        .map((art) => (data._isMock ? { ...art, _isMock: true } : art));
    }
  } catch (err) {
    console.warn('Fallo en lote de artistas destacados, intentando individual:', err);
  }

  const results = await Promise.allSettled(
    FEATURED_ARTIST_IDS.map((id) => spotifyFetch(`/artists/${id}`, token))
  );

  return results
    .filter((res) => res.status === 'fulfilled' && res.value?.id)
    .map((res) => res.value);
};

// 3. Buscador general (Search)
export const searchSpotify = (query, token) =>
  spotifyFetch(
    `/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=10`,
    token
  );

// 4. Detalle de Artista (Artist Detail)
export const getArtist = (id, token) => 
  spotifyFetch(`/artists/${id}`, token);

// Obtener canciones populares del artista mediante búsqueda filtrada
export const getArtistTracks = (artistName, token) =>
  spotifyFetch(
    `/search?q=artist:"${encodeURIComponent(artistName)}"&type=track&limit=10`,
    token
  );

export const getArtistAlbums = (id, token) =>
  spotifyFetch(
    `/artists/${id}/albums?include_groups=album,single&limit=10`,
    token
  );

// 5. Detalle de Álbum (Album Detail)
export const getAlbum = (id, token) => 
  spotifyFetch(`/albums/${id}`, token);