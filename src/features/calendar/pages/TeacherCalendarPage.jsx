/**
 * Teacher Calendar Page
 * Página de calendario completo del profesor
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@design';
import { useAuth } from '@features/auth';
import { useTeacherBookings } from '@features/bookings';
import { cancelBooking, updateBookingStatus } from '@features/bookings';
import { validateCancellation } from '@features/bookings';
import Calendar from '../components/Calendar';
import EventDetailsModal from '../components/EventDetailsModal';
import GoogleCalendarSync from '../components/GoogleCalendarSync';
import { useNavigate } from 'react-router-dom';

const TeacherCalendarPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Estados
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [googleSyncEnabled, setGoogleSyncEnabled] = useState(false);
  
  // Bookings
  const { bookings, loading, refetch } = useTeacherBookings(user?.uid);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    thisMonth: 0,
  });

  useEffect(() => {
    calculateStats();
  }, [bookings]);

  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const stats = {
      total: bookings.length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      thisMonth: bookings.filter((b) => {
        const bookingDate = new Date(b.date);
        return (
          bookingDate.getMonth() === currentMonth &&
          bookingDate.getFullYear() === currentYear
        );
      }).length,
    };

    setStats(stats);
  };

  const getFilteredBookings = () => {
    if (filterStatus === 'all') return bookings;
    return bookings.filter((b) => b.status === filterStatus);
  };

  const getCalendarEvents = () => {
    return getFilteredBookings().map((booking) => ({
      ...booking,
      title: `${booking.studentName} - ${booking.productTitle || 'Clase'}`,
    }));
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCancelBooking = async (booking) => {
    // Validar si se puede cancelar
    const { availability } = await getTeacherAvailability(user.uid);
    const validation = validateCancellation(availability, booking);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    if (!window.confirm('¿Estás seguro de que quieres cancelar esta clase?')) {
      return;
    }

    const reason = prompt('Razón de cancelación (opcional):');

    try {
      const { error } = await cancelBooking(booking.id, user.uid, reason || 'Cancelada por el profesor');

      if (error) {
        alert('Error al cancelar: ' + error);
        return;
      }

      alert('Clase cancelada correctamente');
      setShowEventModal(false);
      refetch();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error al cancelar la clase');
    }
  };

  const handleConfirmBooking = async (booking) => {
    try {
      const { error } = await updateBookingStatus(booking.id, 'confirmed');

      if (error) {
        alert('Error al confirmar: ' + error);
        return;
      }

      alert('Clase confirmada correctamente');
      setShowEventModal(false);
      refetch();
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Error al confirmar la clase');
    }
  };

  const canCancelBooking = (booking) => {
    const now = new Date();
    const bookingDate = new Date(`${booking.date} ${booking.time}`);
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
    return hoursDiff >= 24 && booking.status === 'confirmed';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mi Calendario</h1>
            <p className="text-[var(--brand-muted)]">
              Gestiona todas tus clases y reservas
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => navigate('/teacher/availability')}
            >
              ⚙️ Configurar Disponibilidad
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/dashboard')}>
              ← Dashboard
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-[var(--brand-bg-alt)] rounded-lg">
            <p className="text-sm text-[var(--brand-muted)] mb-1">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Confirmadas</p>
            <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600 mb-1">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600 mb-1">Canceladas</p>
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Este Mes</p>
            <p className="text-2xl font-bold text-blue-700">{stats.thisMonth}</p>
          </div>
        </div>
      </Card>

      {/* Filters & Google Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters */}
        <Card variant="outlined" padding="lg" className="lg:col-span-2">
          <h3 className="font-bold mb-4">Filtrar por Estado</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Todas ({bookings.length})
            </Button>
            <Button
              variant={filterStatus === 'confirmed' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('confirmed')}
            >
              Confirmadas ({stats.confirmed})
            </Button>
            <Button
              variant={filterStatus === 'pending' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending')}
            >
              Pendientes ({stats.pending})
            </Button>
            <Button
              variant={filterStatus === 'cancelled' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('cancelled')}
            >
              Canceladas ({stats.cancelled})
            </Button>
          </div>
        </Card>

        {/* Google Calendar Sync */}
        <GoogleCalendarSync onSyncStatusChange={setGoogleSyncEnabled} />
      </div>

      {/* Calendar */}
      {loading ? (
        <Card variant="outlined" padding="lg">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--brand-muted)]">Cargando calendario...</p>
          </div>
        </Card>
      ) : (
        <Calendar
          events={getCalendarEvents()}
          onEventClick={handleEventClick}
        />
      )}

      {/* Upcoming Classes */}
      <Card variant="elevated" padding="lg">
        <h3 className="text-lg font-bold mb-4">Próximas Clases</h3>
        
        {getFilteredBookings()
          .filter((b) => new Date(b.date) >= new Date() && b.status === 'confirmed')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 5)
          .map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 bg-[var(--brand-bg-alt)] rounded-lg mb-3 hover:bg-[var(--brand-border)] transition-colors cursor-pointer"
              onClick={() => handleEventClick(booking)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center text-white font-bold">
                  {booking.studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{booking.studentName}</p>
                  <p className="text-sm text-[var(--brand-muted)]">
                    {booking.productTitle || 'Clase Individual'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{booking.date}</p>
                <p className="text-sm text-[var(--brand-muted)]">{booking.time}</p>
              </div>
            </div>
          ))}

        {getFilteredBookings().filter((b) => new Date(b.date) >= new Date() && b.status === 'confirmed').length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📅</div>
            <p className="text-[var(--brand-muted)]">No tienes clases próximas</p>
          </div>
        )}
      </Card>

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={selectedEvent}
        onCancel={handleCancelBooking}
        canCancel={selectedEvent ? canCancelBooking(selectedEvent) : false}
      />
    </div>
  );
};

export default TeacherCalendarPage;
