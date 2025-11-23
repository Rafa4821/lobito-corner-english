/**
 * Ejemplo de integración con sistema de reservas
 * Este archivo muestra cómo usar el sistema de notificaciones
 * cuando se crea, actualiza o cancela una reserva
 */

import { useNotifications } from '../hooks/useNotifications';
import { sendBookingCancellation } from '../services/emailService';

/**
 * Ejemplo 1: Crear reserva y enviar notificaciones
 */
export const createBookingWithNotifications = async (bookingData) => {
  // 1. Crear la reserva en Firestore
  const bookingRef = await addDoc(collection(db, 'bookings'), {
    userId: bookingData.userId,
    productId: bookingData.productId,
    teacherId: bookingData.teacherId,
    bookingDateTime: bookingData.bookingDateTime,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  });

  // 2. Preparar datos para notificaciones
  const notificationData = {
    bookingId: bookingRef.id,
    userId: bookingData.userId,
    userEmail: bookingData.userEmail,
    userName: bookingData.userName,
    productTitle: bookingData.productTitle,
    teacherName: bookingData.teacherName,
    bookingDate: formatDate(bookingData.bookingDateTime),
    bookingTime: formatTime(bookingData.bookingDateTime),
    duration: bookingData.duration,
    price: bookingData.price,
    bookingDateTime: bookingData.bookingDateTime,
  };

  // 3. Enviar confirmación y programar recordatorios
  const { sendBookingConfirmation } = useNotifications();
  await sendBookingConfirmation(notificationData);

  return bookingRef.id;
};

/**
 * Ejemplo 2: Cancelar reserva y enviar notificación
 */
export const cancelBookingWithNotification = async (bookingId, reason) => {
  // 1. Obtener datos de la reserva
  const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
  const booking = bookingDoc.data();

  // 2. Actualizar estado en Firestore
  await updateDoc(doc(db, 'bookings', bookingId), {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: reason,
  });

  // 3. Cancelar notificaciones programadas
  const { cancelNotifications } = useNotifications();
  await cancelNotifications(bookingId);

  // 4. Enviar email de cancelación
  await sendBookingCancellation({
    userEmail: booking.userEmail,
    userName: booking.userName,
    productTitle: booking.productTitle,
    bookingDate: formatDate(booking.bookingDateTime),
    bookingTime: formatTime(booking.bookingDateTime),
    reason,
  });
};

/**
 * Ejemplo 3: Componente React con notificaciones
 */
export const BookingForm = () => {
  const { sendBookingConfirmation, loading, error } = useNotifications();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Crear reserva
      const bookingId = await createBooking(formData);

      // Enviar notificaciones
      await sendBookingConfirmation({
        bookingId,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        productTitle: product.title,
        teacherName: product.teacherName,
        bookingDate: formatDate(formData.dateTime),
        bookingTime: formatTime(formData.dateTime),
        duration: product.duration,
        price: product.price,
        bookingDateTime: formData.dateTime,
      });

      // Mostrar éxito
      alert('¡Reserva confirmada! Revisa tu email.');
      navigate('/bookings');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la reserva');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario de reserva */}
      <button type="submit" disabled={loading}>
        {loading ? 'Procesando...' : 'Confirmar Reserva'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};

/**
 * Utilidades de formato
 */
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
