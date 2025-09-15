import React, { useState, useCallback } from 'react';
import LoginPage from './components/LoginPage';
import StockPage from './components/StockPage';
import ProfilePage from './components/ProfilePage';
import useLocalStorage from './hooks/useLocalStorage';
import { UserCredentials } from './types';

function App() {
  const [user, setUser] = useLocalStorage<UserCredentials>('userCredentials', { username: 'admin', password: 'admin123' });
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('isAuthenticated', false);
  const [currentPage, setCurrentPage] = useState<'stock' | 'profile'>('stock');

  const handleLogin = useCallback((credentials: Omit<UserCredentials, 'id'>) => {
    if (credentials.username === user.username && credentials.password === user.password) {
      setIsAuthenticated(true);
      setCurrentPage('stock');
      return true;
    }
    return false;
  }, [user, setIsAuthenticated]);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  const handleUpdateUser = useCallback((newCredentials: UserCredentials) => {
    setUser(newCredentials);
    // For security, log out the user to force re-login with new credentials
    handleLogout();
  }, [setUser, handleLogout]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      {currentPage === 'stock' ? (
        <StockPage 
          onLogout={handleLogout} 
          onNavigateToProfile={() => setCurrentPage('profile')} 
        />
      ) : (
        <ProfilePage 
          currentUser={user}
          onUpdateUser={handleUpdateUser}
          onBack={() => setCurrentPage('stock')}
        />
      )}
    </div>
  );
}

export default App;
