/**
 * Notification Bell Component
 * Campana de notificaciones con dropdown
 */

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@design';
import { useAuth } from '@features/auth';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const NotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    // Query para últimas 5 notificaciones
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      let unread = 0;

      snapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        notifs.push(data);
        if (!data.read) unread++;
      });

      setNotifications(notifs);
      setUnreadCount(unread);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        read: true,
        readAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Marcar como leída
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    // Navegar según el tipo
    switch (notification.type) {
      case 'booking_confirmation':
      case 'reminder_24h':
      case 'reminder_same_day':
        navigate('/bookings');
        break;
      case 'new_recording':
        navigate('/recordings');
        break;
      case 'new_message':
        navigate('/app/chat');
        break;
      case 'new_blog_post':
        navigate('/app/blog');
        break;
      default:
        navigate('/app/notifications');
    }

    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      booking_confirmation: '✅',
      reminder_24h: '⏰',
      reminder_same_day: '🔔',
      new_recording: '📹',
      new_message: '💬',
      new_blog_post: '📝',
      booking_rescheduled: '📅',
      class_completed: '🎓',
    };
    return icons[type] || '🔔';
  };

  const getNotificationTitle = (notification) => {
    const titles = {
      booking_confirmation: 'Reserva Confirmada',
      reminder_24h: 'Recordatorio: Clase Mañana',
      reminder_same_day: 'Recordatorio: Clase Hoy',
      new_recording: 'Nueva Grabación',
      new_message: 'Nuevo Mensaje',
      new_blog_post: 'Nuevo Post',
      booking_rescheduled: 'Clase Reprogramada',
      class_completed: 'Clase Completada',
    };
    return titles[notification.type] || 'Notificación';
  };

  const getNotificationMessage = (notification) => {
    if (notification.data?.message) {
      return notification.data.message;
    }

    switch (notification.type) {
      case 'booking_confirmation':
        return `Tu clase con ${notification.data?.teacherName || 'el profesor'} está confirmada`;
      case 'reminder_24h':
        return `Tu clase es mañana a las ${notification.data?.bookingTime || ''}`;
      case 'reminder_same_day':
        return `Tu clase es hoy a las ${notification.data?.bookingTime || ''}`;
      case 'new_recording':
        return `${notification.data?.teacherName || 'Tu profesor'} subió una nueva grabación`;
      case 'new_message':
        return `${notification.data?.senderName || 'Alguien'} te envió un mensaje`;
      case 'new_blog_post':
        return `Nuevo post: ${notification.data?.postTitle || ''}`;
      default:
        return 'Tienes una nueva notificación';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // segundos

    if (diff < 60) return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)}d`;
    return date.toLocaleDateString('es-AR');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg hover:bg-[var(--brand-bg-alt)] transition-colors"
        aria-label="Notificaciones"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <Badge
            variant="error"
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-lg border border-[var(--brand-border)] z-50 max-h-[500px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Notificaciones</h3>
              {unreadCount > 0 && (
                <Badge variant="primary">{unreadCount} nuevas</Badge>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand-primary)] mx-auto mb-2"></div>
                <p className="text-sm text-[var(--brand-muted)]">Cargando...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-sm text-[var(--brand-muted)]">No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 border-b border-[var(--brand-border)] cursor-pointer
                    hover:bg-[var(--brand-bg-alt)] transition-colors
                    ${!notification.read ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm">
                          {getNotificationTitle(notification)}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-[var(--brand-muted)] line-clamp-2">
                        {getNotificationMessage(notification)}
                      </p>
                      <p className="text-xs text-[var(--brand-muted)] mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--brand-border)] bg-[var(--brand-bg-alt)]">
            <button
              onClick={() => {
                navigate('/notifications');
                setShowDropdown(false);
              }}
              className="w-full text-center text-sm text-[var(--brand-primary)] hover:underline font-medium"
            >
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
