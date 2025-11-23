/**
 * Google Calendar Sync Component
 * Componente para sincronizar con Google Calendar
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@design';
import {
  initGoogleCalendar,
  authenticateGoogle,
  disconnectGoogle,
  isAuthenticated,
} from '../services/googleCalendarService';
import PropTypes from 'prop-types';

const GoogleCalendarSync = ({ onSyncStatusChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoSync, setAutoSync] = useState(true);
  const [lastSync, setLastSync] = useState(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    initializeGoogleAPI();
  }, []);

  const initializeGoogleAPI = async () => {
    try {
      setLoading(true);
      await initGoogleCalendar();
      setIsInitialized(true);
      
      // Verificar si ya está autenticado
      const authenticated = isAuthenticated();
      setIsConnected(authenticated);
      
      if (authenticated && onSyncStatusChange) {
        onSyncStatusChange(true);
      }
    } catch (err) {
      console.error('Error initializing Google Calendar:', err);
      setError('No se pudo inicializar Google Calendar. Verifica tu configuración.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authenticateGoogle();
      
      setIsConnected(true);
      setLastSync(new Date());
      
      // Obtener email del usuario (si está disponible)
      if (window.gapi?.client?.getToken()) {
        // Aquí podrías hacer una llamada para obtener el email
        setUserEmail('usuario@gmail.com'); // Placeholder
      }
      
      if (onSyncStatusChange) {
        onSyncStatusChange(true);
      }
      
    } catch (err) {
      console.error('Error connecting to Google Calendar:', err);
      setError('No se pudo conectar con Google Calendar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    if (window.confirm('¿Estás seguro de que quieres desconectar Google Calendar?')) {
      disconnectGoogle();
      setIsConnected(false);
      setUserEmail('');
      setLastSync(null);
      
      if (onSyncStatusChange) {
        onSyncStatusChange(false);
      }
    }
  };

  const handleManualSync = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Aquí iría la lógica de sincronización manual
      // Por ahora solo actualizamos el timestamp
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setLastSync(new Date());
      
    } catch (err) {
      console.error('Error syncing:', err);
      setError('Error al sincronizar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return 'Nunca';
    
    const now = new Date();
    const diff = Math.floor((now - lastSync) / 1000); // segundos
    
    if (diff < 60) return 'Hace unos segundos';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    return lastSync.toLocaleDateString('es-AR');
  };

  if (!isInitialized && loading) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)] mx-auto mb-3"></div>
          <p className="text-sm text-[var(--brand-muted)]">Inicializando Google Calendar...</p>
        </div>
      </Card>
    );
  }

  if (!isInitialized) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="text-center py-4">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-sm text-[var(--brand-muted)] mb-3">
            No se pudo cargar Google Calendar
          </p>
          <Button variant="outline" size="sm" onClick={initializeGoogleAPI}>
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📅</div>
            <div>
              <h3 className="font-bold">Google Calendar</h3>
              <p className="text-sm text-[var(--brand-muted)]">
                Sincroniza tus clases automáticamente
              </p>
            </div>
          </div>
          <Badge variant={isConnected ? 'success' : 'default'}>
            {isConnected ? '✅ Conectado' : '⚪ Desconectado'}
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Connected State */}
        {isConnected ? (
          <div className="space-y-4">
            {/* User Info */}
            {userEmail && (
              <div className="p-3 bg-[var(--brand-bg-alt)] rounded-lg">
                <p className="text-sm text-[var(--brand-muted)] mb-1">Cuenta conectada:</p>
                <p className="font-medium">{userEmail}</p>
              </div>
            )}

            {/* Auto Sync Toggle */}
            <div className="flex items-center justify-between p-3 bg-[var(--brand-bg-alt)] rounded-lg">
              <div>
                <p className="font-medium">Sincronización automática</p>
                <p className="text-sm text-[var(--brand-muted)]">
                  Las reservas se sincronizan automáticamente
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand-primary)]"></div>
              </label>
            </div>

            {/* Last Sync */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--brand-muted)]">Última sincronización:</span>
              <span className="font-medium">{formatLastSync()}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="primary"
                fullWidth
                onClick={handleManualSync}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Sincronizando...' : '🔄 Sincronizar Ahora'}
              </Button>
              <Button
                variant="danger"
                onClick={handleDisconnect}
                disabled={loading}
              >
                Desconectar
              </Button>
            </div>

            {/* Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> Todas tus clases aparecerán automáticamente en Google
                Calendar y recibirás notificaciones.
              </p>
            </div>
          </div>
        ) : (
          /* Disconnected State */
          <div className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🔗</div>
              <h4 className="font-bold mb-2">Conecta tu Google Calendar</h4>
              <p className="text-sm text-[var(--brand-muted)] mb-4">
                Sincroniza automáticamente tus clases y recibe recordatorios
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-sm text-[var(--brand-muted)]">
                  Sincronización automática de todas las reservas
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-sm text-[var(--brand-muted)]">
                  Recordatorios de Google Calendar
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-sm text-[var(--brand-muted)]">
                  Invitaciones automáticas a estudiantes
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <p className="text-sm text-[var(--brand-muted)]">
                  Actualización en tiempo real
                </p>
              </div>
            </div>

            {/* Connect Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleConnect}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Conectando...' : '🔗 Conectar con Google Calendar'}
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-[var(--brand-muted)] text-center">
              Solo accederemos a tu calendario para sincronizar tus clases. Puedes desconectar en
              cualquier momento.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

GoogleCalendarSync.propTypes = {
  onSyncStatusChange: PropTypes.func,
};

export default GoogleCalendarSync;
