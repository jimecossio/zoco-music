// api/token.js
export default async function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Faltan variables de entorno' });
  }

  console.log('1. Antes del fetch a Spotify');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  console.log('2. Después del fetch, status:', response.status);

  const data = await response.json();

  console.log('3. Data parseada:', data);

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  res.status(200).json({
    access_token: data.access_token,
    expires_in: data.expires_in,
  });
}