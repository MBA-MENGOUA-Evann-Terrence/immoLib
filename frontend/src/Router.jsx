import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ListingsProvider } from './context/ListingsContext';

import HomePage from './Pages/HomePage';
import PostListingPage from './Pages/PostListingPage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import PropertyDetailPage from './Pages/PropertyDetailPage';

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ListingsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/annonces" element={<Navigate to="/" replace />} />
            <Route path="/carte" element={<Navigate to="/" replace />} />
            <Route path="/favoris" element={<Navigate to="/" replace />} />
            <Route path="/annonces/:id" element={<PropertyDetailPage />} />
            <Route path="/deposer" element={<PostListingPage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<RegisterPage />} />
          </Routes>
        </ListingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
