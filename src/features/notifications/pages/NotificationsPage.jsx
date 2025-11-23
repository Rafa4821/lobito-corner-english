/**
 * Notifications Page
 * Página completa de notificaciones
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@design';
import { useAuth } from '@features/auth';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [notifications, filter, typeFilter]);

  const loadNotifications = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notifs = [];

      querySnapshot.forEach((docSnap) => {
        notifs.push({ id: docSnap.id, ...docSnap.data() });
      });

      setNotifications(notifs);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filtro por estado
    if (filter === 'unread') {
      filtered = filtered.filter((n) => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter((n) => n.read);
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((n) => n.type === typeFilter);
    }

    setFilteredNotifications(filtered);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        read: true,
        readAt: new Date().toISOString(),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      const unreadNotifs = notifications.filter((n) => !n.read);

      unreadNotifs.forEach((notif) => {
        const notifRef = doc(db, 'notifications', notif.id);
        batch.update(notifRef, {
          read: true,
          readAt: new Date().toISOString(),
        });
      });

      await batch.commit();

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!window.confirm('¿Eliminar esta notificación?')) return;

    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    switch (notification.type) {
      case 'booking_confirmation':
      case 'reminder_24h':
      case 'reminder_same_day':
      case 'booking_rescheduled':
        navigate('/bookings');
        break;
      case 'new_recording':
        navigate('/recordings');
        break;
      case 'new_message':
        navigate('/chat');
        break;
      case 'new_blog_post':
        navigate('/blog');
        break;
      default:
        break;
    }
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
        return `Tu clase con ${notification.data?.teacherName || 'el profesor'} está confirmada para el ${notification.data?.bookingDate || ''} a las ${notification.data?.bookingTime || ''}`;
      case 'reminder_24h':
        return `Recuerda que tu clase con ${notification.data?.teacherName || 'el profesor'} es mañana a las ${notification.data?.bookingTime || ''}`;
      case 'reminder_same_day':
        return `Tu clase con ${notification.data?.teacherName || 'el profesor'} es hoy a las ${notification.data?.bookingTime || ''}`;
      case 'new_recording':
        return `${notification.data?.teacherName || 'Tu profesor'} subió una nueva grabación: ${notification.data?.recordingTitle || ''}`;
      case 'new_message':
        return `${notification.data?.senderName || 'Alguien'} te envió un mensaje`;
      case 'new_blog_post':
        return `Nuevo post publicado: ${notification.data?.postTitle || ''}`;
      default:
        return 'Tienes una nueva notificación';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
            <p className="text-[var(--brand-muted)]">
              Gestiona todas tus notificaciones
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Volver
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-[var(--brand-bg-alt)] rounded-lg">
            <p className="text-sm text-[var(--brand-muted)] mb-1">Total</p>
            <p className="text-2xl font-bold">{notifications.length}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">No leídas</p>
            <p className="text-2xl font-bold text-blue-700">{unreadCount}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Leídas</p>
            <p className="text-2xl font-bold text-green-700">
              {notifications.length - unreadCount}
            </p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card variant="outlined" padding="lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              No leídas ({unreadCount})
            </Button>
            <Button
              variant={filter === 'read' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
            >
              Leídas
            </Button>
          </div>

          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
              ✓ Marcar todas como leídas
            </Button>
          )}
        </div>
      </Card>

      {/* Notifications List */}
      {loading ? (
        <Card variant="outlined" padding="lg">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--brand-muted)]">Cargando notificaciones...</p>
          </div>
        </Card>
      ) : filteredNotifications.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <h3 className="text-xl font-bold mb-2">No hay notificaciones</h3>
            <p className="text-[var(--brand-muted)]">
              {filter === 'unread'
                ? 'No tienes notificaciones sin leer'
                : 'Aún no tienes notificaciones'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              variant={notification.read ? 'outlined' : 'elevated'}
              padding="lg"
              className={`
                cursor-pointer hover:shadow-lg transition-shadow
                ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}
              `}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-lg mb-1">
                        {getNotificationTitle(notification)}
                      </h3>
                      <p className="text-sm text-[var(--brand-muted)]">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <Badge variant="primary">Nueva</Badge>
                    )}
                  </div>

                  <p className="text-[var(--brand-muted)] mb-3">
                    {getNotificationMessage(notification)}
                  </p>

                  <div className="flex gap-2">
                    {!notification.read && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        ✓ Marcar como leída
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                    >
                      🗑️ Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
