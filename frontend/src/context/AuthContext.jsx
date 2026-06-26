import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../api/services/auth.service.js';
import { setAuthToken } from '../api/client.js';

const TOKEN_KEY = 'immolib_token';
const USER_KEY = 'immolib_user';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function readStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [utilisateur, setUtilisateur] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const persistSession = useCallback((newToken, user) => {
    setToken(newToken);
    setUtilisateur(user);
    setAuthToken(newToken);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, []);

  const clearSession = useCallback(() => {
    setToken(null);
    setUtilisateur(null);
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  /**
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.connexion(credentials);
      persistSession(data.token, data.utilisateur);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  /**
   * @param {{ nom: string, email: string, password: string, telephone?: string }} payload
   */
  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.inscription(payload);
      persistSession(data.token, data.utilisateur);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const logout = useCallback(() => {
    clearSession();
    setError(null);
  }, [clearSession]);

  const value = useMemo(
    () => ({
      token,
      utilisateur,
      isAuthenticated: Boolean(token),
      loading,
      error,
      login,
      register,
      logout,
    }),
    [token, utilisateur, loading, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
