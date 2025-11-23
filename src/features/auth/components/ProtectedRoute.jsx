/**
 * Protected Route Component
 * Protege rutas que requieren autenticación
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { user, userData, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]"></div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar rol si es requerido
  if (requireRole && userData?.role !== requireRole) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="text-6xl">🚫</div>
          <h1 className="text-2xl font-bold">Acceso Denegado</h1>
          <p className="text-[var(--brand-muted)]">
            No tienes permisos para acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireRole: PropTypes.oneOf(['student', 'teacher', null]),
};

export default ProtectedRoute;
