// src/hooks/useSpotifyToken.js
import { useState, useEffect } from 'react';

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getSpotifyToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60000) {
    return cachedToken;
  }

  const res = await fetch('/api/token');
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Error ${res.status}: No se pudo obtener el token`);
  }
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = now + (data.expires_in || 3600) * 1000;
  return cachedToken;
}

export function useSpotifyToken() {
  const [token, setToken] = useState(cachedToken);
  const [loading, setLoading] = useState(!cachedToken);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getSpotifyToken()
      .then((t) => {
        if (isMounted) {
          setToken(t);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error al conectar con el servidor de autenticación');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { token, loading, error };
}