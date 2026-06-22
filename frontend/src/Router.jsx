import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListingsProvider } from './context/ListingsContext';
import { FavoritesProvider } from './context/FavoritesContext';

import HomePage from './Pages/HomePage';
import AnnoncesPage from './Pages/AnnoncesPage';
import FavorisPage from './Pages/FavorisPage';
import PostListingPage from './Pages/PostListingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import PropertyDetailPage from './Pages/PropertyDetailPage';

export default function Router() {
  return (
    <BrowserRouter>
      <ListingsProvider>
        <FavoritesProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/annonces" element={<AnnoncesPage />} />
            <Route path="/annonces/:id" element={<PropertyDetailPage />} />
            <Route path="/favoris" element={<FavorisPage />} />
            <Route path="/deposer" element={<PostListingPage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
          </Routes>
        </FavoritesProvider>
      </ListingsProvider>
    </BrowserRouter>
  );
}
