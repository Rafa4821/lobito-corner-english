/**
 * Student Booking Page
 * Página para que estudiantes reserven clases
 */

import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '@design';
import { useAuth } from '@features/auth';
import { getAllProducts } from '@features/products';
import { getTeacherAvailability, generateAvailableSlots } from '@features/bookings';
import { getBookingsByDateAndTeacher, createBooking } from '@features/bookings';
import { syncBookingToGoogle } from '../services/googleCalendarService';
import Calendar from '../components/Calendar';
import TimeSlotPicker from '../components/TimeSlotPicker';
import BookingModal from '../components/BookingModal';
import { useNavigate } from 'react-router-dom';

const StudentBookingPage = () => {
  const navigate = useNavigate();
  const { user, userData } = useAuth();
  
  // Estados
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [products, setProducts] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  
  // Loading states
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [creatingBooking, setCreatingBooking] = useState(false);
  
  // Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Teacher ID (en producción, obtener del contexto o props)
  const teacherId = 'teacher_demo_id';
  const teacherName = 'Profesor Demo';

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadProducts(),
      loadAvailability(),
      loadMyBookings(),
    ]);
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    const { products: data } = await getAllProducts();
    setProducts(data || []);
    setLoadingProducts(false);
  };

  const loadAvailability = async () => {
    setLoadingAvailability(true);
    const { availability: data } = await getTeacherAvailability(teacherId);
    setAvailability(data);
    
    // Generar fechas destacadas (próximos 30 días con disponibilidad)
    if (data) {
      const dates = generateHighlightedDates(data);
      setHighlightedDates(dates);
    }
    
    setLoadingAvailability(false);
  };

  const loadMyBookings = async () => {
    // En producción, usar useStudentBookings hook
    setMyBookings([]);
  };

  const generateHighlightedDates = (availability) => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayOfWeek = getDayOfWeek(date);
      const daySchedule = availability.weeklySchedule[dayOfWeek];
      
      if (daySchedule && daySchedule.length > 0) {
        dates.push(formatDate(date));
      }
    }
    
    return dates;
  };

  const handleDateClick = async (date) => {
    setSelectedDate(formatDate(date));
    setSelectedTime(null);
    setLoadingSlots(true);

    try {
      // Obtener reservas existentes para esa fecha
      const { bookings } = await getBookingsByDateAndTeacher(teacherId, formatDate(date));
      
      // Generar slots disponibles
      if (availability) {
        const availableSlots = generateAvailableSlots(availability, date, bookings);
        setSlots(availableSlots);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona una fecha y hora');
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (bookingData) => {
    setCreatingBooking(true);

    try {
      // Crear reserva en Firestore
      const { booking, error } = await createBooking({
        studentId: user.uid,
        studentName: userData.name,
        studentEmail: user.email,
        teacherId: teacherId,
        teacherName: teacherName,
        teacherEmail: 'profesor@demo.com', // En producción, obtener del teacher
        productId: bookingData.productId,
        productTitle: bookingData.productTitle,
        date: bookingData.date,
        time: bookingData.time,
        duration: 60,
        notes: bookingData.notes,
      });

      if (error) {
        alert('Error al crear la reserva: ' + error);
        return;
      }

      // Intentar sincronizar con Google Calendar (si está conectado)
      try {
        await syncBookingToGoogle(booking);
      } catch (syncError) {
        console.log('Google Calendar sync skipped:', syncError);
      }

      // Éxito
      alert('¡Reserva confirmada! Recibirás un email de confirmación.');
      setShowBookingModal(false);
      setSelectedDate(null);
      setSelectedTime(null);
      
      // Redirigir al dashboard
      navigate('/student/dashboard');
      
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error al crear la reserva. Intenta nuevamente.');
    } finally {
      setCreatingBooking(false);
    }
  };

  const getDayOfWeek = (date) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reservar Clase</h1>
            <p className="text-[var(--brand-muted)]">
              Selecciona una fecha y hora disponible para tu clase con {teacherName}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/student/dashboard')}>
            ← Volver
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {(loadingProducts || loadingAvailability) && (
        <Card variant="outlined" padding="lg">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
            <p className="text-[var(--brand-muted)]">Cargando disponibilidad...</p>
          </div>
        </Card>
      )}

      {/* Main Content */}
      {!loadingProducts && !loadingAvailability && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Calendar
              events={myBookings}
              onDateClick={handleDateClick}
              highlightedDates={highlightedDates}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Slot Picker */}
            <TimeSlotPicker
              date={selectedDate}
              slots={slots}
              selectedSlot={selectedTime}
              onSlotSelect={handleSlotSelect}
              loading={loadingSlots}
            />

            {/* Book Button */}
            {selectedDate && selectedTime && (
              <Card variant="elevated" padding="lg">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[var(--brand-muted)] mb-2">Selección actual:</p>
                    <div className="p-3 bg-[var(--brand-bg-alt)] rounded-lg space-y-1">
                      <p className="font-medium">📅 {selectedDate}</p>
                      <p className="font-medium">⏰ {selectedTime}</p>
                      <p className="text-sm text-[var(--brand-muted)]">
                        Con {teacherName}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    onClick={handleBookNow}
                  >
                    Reservar Ahora
                  </Button>
                </div>
              </Card>
            )}

            {/* Info Card */}
            <Card variant="outlined" padding="md">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">💡</span>
                  <h3 className="font-bold">Consejos</h3>
                </div>
                <ul className="text-sm text-[var(--brand-muted)] space-y-2">
                  <li>• Los días destacados tienen disponibilidad</li>
                  <li>• Puedes cancelar hasta 24h antes</li>
                  <li>• Recibirás recordatorios por email</li>
                  <li>• Revisa tus clases en el dashboard</li>
                </ul>
              </div>
            </Card>

            {/* Products Info */}
            {products.length > 0 && (
              <Card variant="outlined" padding="md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    <h3 className="font-bold">Clases Disponibles</h3>
                  </div>
                  <div className="space-y-2">
                    {products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="p-2 bg-[var(--brand-bg-alt)] rounded text-sm"
                      >
                        <p className="font-medium">{product.title}</p>
                        {product.duration && (
                          <p className="text-xs text-[var(--brand-muted)]">
                            {product.duration} minutos
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        products={products}
        teacherName={teacherName}
        loading={creatingBooking}
      />
    </div>
  );
};

export default StudentBookingPage;
