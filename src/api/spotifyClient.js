// src/api/spotifyClient.js
import { getSpotifyToken } from '../hooks/useSpotifyToken';
import { getMockResponse } from './mockData';

const BASE_URL = 'https://api.spotify.com/v1';

export { getSpotifyToken };

// Caché en memoria para evitar llamadas redundantes a la API de Spotify
const responseCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutos

export async function spotifyFetch(endpoint, token) {
  const cacheKey = endpoint;
  const now = Date.now();

  // 1. Si existe en caché vigente, retornar de inmediato
  if (responseCache.has(cacheKey)) {
    const cached = responseCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    responseCache.delete(cacheKey);
  }

  let authToken = token;
  if (!authToken) {
    try {
      authToken = await getSpotifyToken();
    } catch {
      authToken = null;
    }
  }

  // Lugar 1: Fallo al obtener token por caída de red o servicio de autenticación
  if (!authToken) {
    const mockFallback = getMockResponse(endpoint);
    if (mockFallback) {
      return { ...mockFallback, _isMock: true };
    }
    throw new Error('No se pudo obtener el token de autenticación de Spotify');
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Lugar 2: Spotify responde 429 (Límite de peticiones / cuota temporal excedida)
    if (res.status === 429) {
      console.warn(`[Spotify API 429] Cuota/Rate limit temporal de Spotify. Activando dataset local de contingencia para: ${endpoint}`);
      const mockFallback = getMockResponse(endpoint);
      if (mockFallback) {
        const marked = { ...mockFallback, _isMock: true };
        responseCache.set(cacheKey, { data: marked, timestamp: now });
        return marked;
      }
    }

    // Para 400, 401, 403, 404, 500, etc.: Dejar pasar el error real para mostrarlo en ErrorState
    if (!res.ok) {
      let errorDetail = '';
      try {
        const errData = await res.json();
        errorDetail = errData?.error?.message || '';
      } catch {
        // Ignorar fallo de parseo JSON
      }

      const message = errorDetail 
        ? `Error ${res.status}: ${errorDetail}` 
        : `Error ${res.status}: ${res.statusText}`;

      throw new Error(message);
    }

    const data = await res.json();

    // Guardar en caché en memoria
    responseCache.set(cacheKey, {
      data,
      timestamp: now,
    });

    return data;
  } catch (err) {
    // Lugar 3: Solo activar mock ante errores reales de red (fetch fallido, conexión caída, offline)
    const isNetworkError =
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('network') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError');

    if (isNetworkError) {
      const mockFallback = getMockResponse(endpoint);
      if (mockFallback) {
        const marked = { ...mockFallback, _isMock: true };
        return marked;
      }
    }

    // Errores HTTP reales (401, 403, 404, etc.) se propagan directamente para manejo con ErrorState
    throw err;
  }
}