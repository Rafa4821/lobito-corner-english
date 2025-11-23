/**
 * Booking Service
 * Servicios de gestión de reservas
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const BOOKINGS_COLLECTION = 'bookings';

/**
 * Estructura de reserva:
 * {
 *   studentId: string,
 *   studentName: string,
 *   teacherId: string,
 *   teacherName: string,
 *   productId: string (opcional),
 *   productTitle: string (opcional),
 *   date: '2024-01-15',
 *   time: '10:00',
 *   duration: 60, // minutos
 *   status: 'pending' | 'confirmed' | 'cancelled' | 'completed',
 *   notes: string (opcional),
 *   cancelledAt: Timestamp (opcional),
 *   cancelledBy: string (opcional),
 *   cancellationReason: string (opcional),
 *   createdAt: Timestamp,
 *   updatedAt: Timestamp,
 * }
 */

/**
 * Crear reserva
 */
export const createBooking = async (bookingData) => {
  try {
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData,
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newBooking = await getDoc(docRef);
    return { booking: { id: newBooking.id, ...newBooking.data() }, error: null };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { booking: null, error: error.message };
  }
};

/**
 * Obtener reserva por ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { booking: { id: docSnap.id, ...docSnap.data() }, error: null };
    }

    return { booking: null, error: 'Reserva no encontrada' };
  } catch (error) {
    console.error('Error getting booking:', error);
    return { booking: null, error: error.message };
  }
};

/**
 * Obtener reservas de un estudiante
 */
export const getStudentBookings = async (studentId, filters = {}) => {
  try {
    let q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('date', 'desc'),
      orderBy('time', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const querySnapshot = await getDocs(q);
    const bookings = [];

    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    return { bookings, error: null };
  } catch (error) {
    console.error('Error getting student bookings:', error);
    return { bookings: [], error: error.message };
  }
};

/**
 * Obtener reservas de un profesor
 */
export const getTeacherBookings = async (teacherId, filters = {}) => {
  try {
    let q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('teacherId', '==', teacherId),
      orderBy('date', 'desc'),
      orderBy('time', 'desc')
    );

    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    const querySnapshot = await getDocs(q);
    const bookings = [];

    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    return { bookings, error: null };
  } catch (error) {
    console.error('Error getting teacher bookings:', error);
    return { bookings: [], error: error.message };
  }
};

/**
 * Obtener reservas por fecha y profesor (para verificar disponibilidad)
 */
export const getBookingsByDateAndTeacher = async (teacherId, date) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('teacherId', '==', teacherId),
      where('date', '==', date),
      where('status', 'in', ['confirmed', 'pending'])
    );

    const querySnapshot = await getDocs(q);
    const bookings = [];

    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    return { bookings, error: null };
  } catch (error) {
    console.error('Error getting bookings by date:', error);
    return { bookings: [], error: error.message };
  }
};

/**
 * Actualizar estado de reserva
 */
export const updateBookingStatus = async (bookingId, status, additionalData = {}) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    
    await updateDoc(docRef, {
      status,
      ...additionalData,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error updating booking status:', error);
    return { error: error.message };
  }
};

/**
 * Cancelar reserva
 */
export const cancelBooking = async (bookingId, cancelledBy, reason = '') => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    
    await updateDoc(docRef, {
      status: 'cancelled',
      cancelledAt: serverTimestamp(),
      cancelledBy,
      cancellationReason: reason,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return { error: error.message };
  }
};

/**
 * Reprogramar reserva
 */
export const rescheduleBooking = async (bookingId, newDate, newTime) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    
    await updateDoc(docRef, {
      date: newDate,
      time: newTime,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    return { error: error.message };
  }
};

/**
 * Eliminar reserva
 */
export const deleteBooking = async (bookingId) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    await deleteDoc(docRef);

    return { error: null };
  } catch (error) {
    console.error('Error deleting booking:', error);
    return { error: error.message };
  }
};

/**
 * Obtener próximas reservas (siguientes 7 días)
 */
export const getUpcomingBookings = async (userId, role) => {
  try {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const todayStr = formatDate(today);
    const nextWeekStr = formatDate(nextWeek);

    const field = role === 'teacher' ? 'teacherId' : 'studentId';

    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where(field, '==', userId),
      where('status', '==', 'confirmed'),
      where('date', '>=', todayStr),
      where('date', '<=', nextWeekStr),
      orderBy('date', 'asc'),
      orderBy('time', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const bookings = [];

    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    return { bookings, error: null };
  } catch (error) {
    console.error('Error getting upcoming bookings:', error);
    return { bookings: [], error: error.message };
  }
};

/**
 * Marcar reserva como completada
 */
export const completeBooking = async (bookingId) => {
  try {
    const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
    
    await updateDoc(docRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error completing booking:', error);
    return { error: error.message };
  }
};

// Utilidades

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
