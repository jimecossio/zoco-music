
import { spotifyFetch } from './spotifyClient';

const FEATURED_ALBUM_IDS = [
  '3RQQmkQEvNCY4prGKE6oc5',
  '1NAmidJlEaVgA3MpcPFYGq',
  '4yP0hdKOZPNshxUOjY0cZj',
  '7aJuG4TFXa2hmE4z1yxc3n',
  '6jbtHi5R0jMXoliU2OS0lo',
  '1Mo92916G2mmG7ajpmSVrc',
];

const FEATURED_ARTIST_IDS = [
  '06HL4z0CvFAxyc27GXpf02',
  '4q3ewBCX7sLwd24euuV69X',
  '1Xyo4u8uXC1ZmMpatF05PJ',
  '6qqNVTkY8uBg9cP3Jd7DAH',
  '6M2wZ9GZgrQXHCFfjv46we',
  '7ltDVBr6mKbRvohxheJ9h1',
];

export const getFeaturedAlbums = async (token) => {
  const results = await Promise.allSettled(
    FEATURED_ALBUM_IDS.map((id) => spotifyFetch(`/albums/${id}`, token))
  );

  return results
    .filter((res) => res.status === 'fulfilled' && res.value?.id)
    .map((res) => res.value);
};

export const getFeaturedArtists = async (token) => {
  const results = await Promise.allSettled(
    FEATURED_ARTIST_IDS.map((id) => spotifyFetch(`/artists/${id}`, token))
  );

  return results
    .filter((res) => res.status === 'fulfilled' && res.value?.id)
    .map((res) => res.value);
};

export const searchSpotify = (query, token) =>
  spotifyFetch(
    `/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=10`,
    token
  );

export const getArtist = (id, token) =>
  spotifyFetch(`/artists/${id}`, token);

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

export const getAlbum = (id, token) =>
  spotifyFetch(`/albums/${id}`, token);