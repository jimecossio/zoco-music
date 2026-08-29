// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PlayerProvider } from './context/PlayerContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <FavoritesProvider>
        <PlayerProvider>
          <App />
        </PlayerProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  </React.StrictMode>
);