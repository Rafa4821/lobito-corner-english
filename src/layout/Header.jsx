/**
 * Header Component
 * Barra superior de navegación
 */

import React from 'react';
import { Logo, Button, Badge } from '@design';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@features/auth';
import { logoutUser } from '@features/auth';
import { NotificationBell } from '@features/notifications';
import PropTypes from 'prop-types';

const Header = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();
  const { user, userData, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--brand-surface)] border-b border-[var(--brand-border)] shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-[var(--brand-bg-alt)] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {sidebarOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          <Logo variant="full" size="sm" className="cursor-pointer" onClick={() => navigate('/')} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          {isAuthenticated && <NotificationBell />}

          {/* Profile - Solo si está autenticado */}
          {isAuthenticated && (
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 p-2 hover:bg-[var(--brand-bg-alt)] rounded-lg transition-colors"
              title={user?.displayName || 'Perfil'}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold text-sm">
                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.displayName?.split(' ')[0] || 'Usuario'}
              </span>
            </button>
          )}

          {/* Login/Logout */}
          {isAuthenticated ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
};

export default Header;
