import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Search from './pages/Search';
import ArtistDetail from './pages/ArtistDetail';
import AlbumDetail from './pages/AlbumDetail';
import Library from './pages/Library';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/artist/:id" element={<ArtistDetail />} />
          <Route path="/album/:id" element={<AlbumDetail />} />
          <Route path="/library" element={<Library />} />
          <Route path="/favorites" element={<Library />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}