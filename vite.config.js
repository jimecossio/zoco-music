import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'spotify-token-middleware',
        configureServer(server) {
          // Intercepta las llamadas a /api/token en desarrollo
          server.middlewares.use('/api/token', async (req, res) => {
            // Carga dinámicamente las variables del archivo .env en cada petición
            const currentEnv = loadEnv(mode, process.cwd(), '');
            const clientId = currentEnv.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
            const clientSecret = currentEnv.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;

            if (!clientId || !clientSecret) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: 'Faltan SPOTIFY_CLIENT_ID o SPOTIFY_CLIENT_SECRET en .env',
                })
              );
              return;
            }

            try {
              const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  Authorization:
                    'Basic ' +
                    Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
                },
                body: 'grant_type=client_credentials',
              });

              const data = await response.json();
              res.statusCode = response.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            } catch (error) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: error.message }));
            }
          });
        },
      },
    ],
  };
});