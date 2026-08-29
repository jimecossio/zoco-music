# 🎵 ZOCO Music — Aplicación Web de Streaming Musical

> **Prueba Técnica Frontend** desarrollada con **React**, **Tailwind CSS v4**, **React Router v7** y la **Spotify Web API**.

ZOCO Music es una plataforma de música inspirada en Spotify que permite explorar álbumes destacados, buscar canciones, artistas y álbumes en tiempo real, visualizar páginas detalladas de discografías y artistas, reproducir música mediante un reproductor inferior global persistente, y gestionar favoritos e historial de escucha con persistencia local (`localStorage`).

---

## 🚀 Características Principales

- **🏠 Home Dinámico**:
  - Saludo dinámico según la hora del día.
  - Sección de **Álbumes Destacados** con carátulas, artistas y año de lanzamiento.
  - Sección de **Artistas Populares** con avatares circulares y géneros.
  - Sección de **Éxitos del Momento** con pistas reproducibles al instante.
- **🔍 Buscador Avanzado (Search)**:
  - Búsqueda en tiempo real con **Debounce (400ms)** para optimizar llamadas a la API.
  - Filtros por pestañas: *Todo*, *Canciones*, *Artistas*, *Álbumes*.
  - Categorías temáticas (*Pop, Rock, Urbano, Chill, Focus, Indie, Electrónica, R&B*) con gradientes y activación directa al hacer clic.
  - Manejo de estados: carga con Skeletons, errores con reintento y `EmptyState` para búsquedas sin coincidencias.
- **👤 Detalle de Artista (`/artist/:id`)**:
  - Cabecera con imagen en alta resolución, badge de artista verificado, número de oyentes/seguidores formateado y géneros musicales.
  - Botón *"Reproducir Éxitos"* que encola todas las canciones principales del artista.
  - Listado de canciones populares y discografía completa de álbumes/singles.
- **💿 Detalle de Álbum (`/album/:id`)**:
  - Portada HD, año de lanzamiento, lista de artistas participantes y total de canciones.
  - Botón *"Reproducir Álbum"* que configura la cola de reproducción con todas las pistas en orden.
  - Tabla de canciones con índice, título, artistas, duración formateada y botones de favoritos y play.
- **🎧 Reproductor Inferior Persistente (Global Player)**:
  - Persiste durante toda la navegación entre rutas sin recargar ni interrumpir la reproducción.
  - **Reproducción real**: Soporte nativo de audio HTML5 para canciones con vista previa (`preview_url`) y temporizador de progreso continuo para canciones sin preview.
  - Controles: **Play / Pause**, **Canción Anterior** (reinicia si transcurrieron >3s o salta a la anterior), **Canción Siguiente**, **Modo Aleatorio (Shuffle)** y **Repetición (Off / Track / All)**.
  - **Barra de progreso interactiva**: Permite arrastrar el control deslizante para adelantar o retroceder (seek).
  - **Control de volumen y Mute** con persistencia en `localStorage`.
  - Botón de agregar/quitar de favoritos directamente en el reproductor.
  - Barra de progreso superior integrada para pantallas móviles.
- **❤️ Tu Biblioteca (`/library`)**:
  - **Canciones Favoritas**: Persistidas en `localStorage`, con contador dinámico y opción de reproducir la lista completa.
  - **Historial Reciente**: Registro automático de las últimas 30 canciones reproducidas, con opción para limpiar el historial.
  - Buscador local para filtrar favoritos e historial en tiempo real.
- **📱 Diseño Responsive & UX**:
  - **Desktop**: Sidebar lateral con acceso rápido y reproductor completo de 3 columnas.
  - **Mobile**: Barra de navegación inferior (`MobileNav`) y reproductor compacto superior optimizado para pantallas táctiles.
  - **Estados de Carga**: Skeletons adaptados a cada tipo de contenido (grid, list, header, circle).
  - **Manejo de Errores**: `ErrorBoundary` global en React y componentes `ErrorState` con botón de reintentar.

---

## 🛠️ Stack Tecnológico

| Tecnología | Propósito | Justificación |
|---|---|---|
| **React 19** | Biblioteca UI | Componentización modular, hooks modernos (`useCallback`, `useRef`, `useContext`) y renderizado eficiente. |
| **Vite 8** | Build tool & Dev server | Arranque ultrarrápido, HMR instantáneo y middleware personalizado para autenticación en desarrollo. |
| **Tailwind CSS v4** | Estilizado | Diseño limpio, variables CSS semánticas en `@theme` y maquetación responsive sin CSS innecesario. |
| **React Router v7** | Enrutamiento SPA | Navegación fluida sin recargas de página (`BrowserRouter`, `Routes`, `Route`, `Outlet`, `useNavigate`, `useParams`). |
| **Lucide React** | Iconografía | Iconos consistentes, accesibles y con soporte para tree-shaking. |
| **Spotify Web API** | Fuente de datos | Catálogo musical global de artistas, álbumes y pistas reales con autenticación *Client Credentials Flow*. |

---

## ⚙️ Instalación y Configuración Local

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd zoco-music
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
SPOTIFY_CLIENT_ID=tu_spotify_client_id
SPOTIFY_CLIENT_SECRET=tu_spotify_client_secret
```

> **¿Cómo obtener credenciales de Spotify?**
> 1. Ingresa a [Spotify for Developers Dashboard](https://developer.spotify.com/dashboard).
> 2. Inicia sesión con tu cuenta de Spotify y haz clic en **Create app**.
> 3. Completa el nombre de la app (ej. `ZOCO Music`) y selecciona **Web API**.
> 4. En los ajustes de la app (*Settings*), copia el **Client ID** y el **Client Secret**.

### 4. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:5173`.

### 5. Compilar para producción
```bash
npm run build
npm run preview
```

---

## 🔒 Arquitectura de Seguridad e Integración con Spotify

La aplicación utiliza el flujo **Client Credentials Flow** de Spotify:

1. **En Desarrollo (`npm run dev`)**:
   - `vite.config.js` implementa un middleware interno interceptando las peticiones a `/api/token`.
   - El middleware toma `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` del entorno de Node y solicita el token a Spotify de forma segura en el servidor local.
2. **En Producción (Vercel)**:
   - `api/token.js` actúa como una Serverless Function de Vercel que procesa la autenticación del lado del servidor.
   - **En ningún momento se exponen las credenciales secretas en el código JavaScript del cliente**.

---

## 📂 Estructura del Proyecto

```
zoco-music/
├── api/
│   └── token.js                 # Serverless function para Vercel
├── public/
├── src/
│   ├── api/
│   │   ├── endpoints.js         # Métodos de consulta a la Spotify API
│   │   └── spotifyClient.js     # Cliente HTTP con interceptor de errores
│   ├── components/
│   │   ├── cards/
│   │   │   ├── AlbumCard.jsx    # Tarjeta de álbum con botón de play rápido
│   │   │   ├── ArtistCard.jsx   # Tarjeta de artista con avatar circular
│   │   │   ├── CategoryCard.jsx # Tarjeta de género/categoría con gradientes
│   │   │   └── TrackCard.jsx    # Fila de canción con play, favorito y duración
│   │   ├── common/
│   │   │   ├── EmptyState.jsx   # Estado vacío personalizable
│   │   │   ├── ErrorBoundary.jsx# Límite de errores global de React
│   │   │   ├── ErrorState.jsx   # Estado de error con reintento
│   │   │   └── LoadingSkeleton.jsx # Skeletons animados (grid, list, header, circle)
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx   # Layout principal con Sidebar, Topbar y Player
│   │   │   ├── MobileNav.jsx    # Barra de navegación inferior mobile
│   │   │   ├── Sidebar.jsx      # Barra lateral desktop
│   │   │   └── Topbar.jsx       # Barra superior con historial y badges
│   │   └── player/
│   │       ├── Player.jsx       # Reproductor inferior persistente global
│   │       ├── PlayerControls.jsx # Controles modulares de reproducción
│   │       └── ProgressBar.jsx  # Barra de progreso interactiva
│   ├── context/
│   │   ├── FavoritesContext.jsx # Estado global de favoritos e historial (localStorage)
│   │   └── PlayerContext.jsx    # Estado global del reproductor y cola de canciones
│   ├── hooks/
│   │   ├── useDebounce.js       # Hook para retrasar búsquedas
│   │   └── useSpotifyToken.js   # Hook de autenticación automática con Spotify
│   ├── pages/
│   │   ├── AlbumDetail.jsx      # Vista de detalle de álbum
│   │   ├── ArtistDetail.jsx     # Vista de detalle de artista
│   │   ├── Home.jsx             # Vista principal (Home)
│   │   ├── Library.jsx          # Vista de biblioteca (Favoritos e Historial)
│   │   └── Search.jsx           # Buscador interactivo
│   ├── utils/
│   │   ├── formatTime.js        # Formateador de milisegundos a mm:ss
│   │   └── storage.js           # Helpers para localStorage seguro
│   ├── App.jsx                  # Configuración de rutas (React Router)
│   ├── index.css                # Estilos globales y tokens Tailwind v4
│   └── main.jsx                 # Punto de entrada con providers y ErrorBoundary
├── .env                         # Variables de entorno locales
├── eslint.config.js             # Configuración de ESLint 9
├── package.json
└── vite.config.js               # Configuración de Vite y middleware de token
```

---

## 🎯 Decisiones de Diseño y Buenas Prácticas

1. **Resiliencia en llamadas a la API**:
   - Se reemplazó `Promise.all` por `Promise.allSettled` en endpoints que cargan múltiples recursos en paralelo. Si un álbum o artista puntual no está disponible en una región, el resto de la interfaz sigue funcionando con normalidad.
2. **Reproducción Híbrida**:
   - Dado que la API pública de Spotify devuelve `preview_url: null` para algunas pistas sin plan Premium, el reproductor implementa un sistema híbrido: reproduce audio real cuando el preview está presente y mantiene sincronizado un temporizador interactivo con controles de progreso (`seek`) cuando no lo está.
3. **Persistencia Transparente**:
   - `FavoritesContext` sincroniza automáticamente con `localStorage` tanto las canciones favoritas como el historial de las últimas 30 reproducciones, garantizando que el usuario conserve su actividad al recargar la página.
4. **Accesibilidad y Microinteracciones**:
   - Atributos `aria-label` en todos los botones interactivos, animaciones en hover/active, indicadores de pista en reproducción activa (ecualizador animado) y transiciones fluidas.

---

Desarrollado para la **Prueba Técnica Frontend — ZOCO Music**.
