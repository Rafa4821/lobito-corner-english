/**
 * Availability Service
 * Servicios de gestión de disponibilidad de profesores
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase';

const AVAILABILITY_COLLECTION = 'teacherAvailability';

/**
 * Estructura de disponibilidad semanal:
 * {
 *   teacherId: string,
 *   weeklySchedule: {
 *     monday: [{ start: '09:00', end: '17:00' }],
 *     tuesday: [{ start: '09:00', end: '17:00' }],
 *     ...
 *   },
 *   slotDuration: 60, // minutos
 *   bufferTime: 15, // minutos entre clases
 *   maxAdvanceBooking: 30, // días
 *   minAdvanceBooking: 1, // días
 *   allowCancellation: true,
 *   cancellationDeadline: 24, // horas antes
 *   allowRescheduling: true,
 *   reschedulingDeadline: 24, // horas antes
 *   timezone: 'America/Argentina/Buenos_Aires',
 *   updatedAt: Timestamp,
 * }
 */

/**
 * Obtener disponibilidad de un profesor
 */
export const getTeacherAvailability = async (teacherId) => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, teacherId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { availability: { id: docSnap.id, ...docSnap.data() }, error: null };
    }

    // Retornar disponibilidad por defecto
    return {
      availability: getDefaultAvailability(teacherId),
      error: null,
    };
  } catch (error) {
    console.error('Error getting teacher availability:', error);
    return { availability: null, error: error.message };
  }
};

/**
 * Configurar disponibilidad de un profesor
 */
export const setTeacherAvailability = async (teacherId, availabilityData) => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, teacherId);
    
    const data = {
      teacherId,
      ...availabilityData,
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, data, { merge: true });

    return { error: null };
  } catch (error) {
    console.error('Error setting teacher availability:', error);
    return { error: error.message };
  }
};

/**
 * Actualizar disponibilidad de un profesor
 */
export const updateTeacherAvailability = async (teacherId, updates) => {
  try {
    const docRef = doc(db, AVAILABILITY_COLLECTION, teacherId);
    
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { error: null };
  } catch (error) {
    console.error('Error updating teacher availability:', error);
    return { error: error.message };
  }
};

/**
 * Obtener disponibilidad por defecto
 */
const getDefaultAvailability = (teacherId) => {
  return {
    teacherId,
    weeklySchedule: {
      monday: [{ start: '09:00', end: '17:00' }],
      tuesday: [{ start: '09:00', end: '17:00' }],
      wednesday: [{ start: '09:00', end: '17:00' }],
      thursday: [{ start: '09:00', end: '17:00' }],
      friday: [{ start: '09:00', end: '17:00' }],
      saturday: [],
      sunday: [],
    },
    slotDuration: 60, // 1 hora
    bufferTime: 15, // 15 minutos entre clases
    maxAdvanceBooking: 30, // 30 días
    minAdvanceBooking: 1, // 1 día
    allowCancellation: true,
    cancellationDeadline: 24, // 24 horas
    allowRescheduling: true,
    reschedulingDeadline: 24, // 24 horas
    timezone: 'America/Argentina/Buenos_Aires',
  };
};

/**
 * Generar slots disponibles para una fecha específica
 */
export const generateAvailableSlots = (availability, date, existingBookings = []) => {
  const dayOfWeek = getDayOfWeek(date);
  const daySchedule = availability.weeklySchedule[dayOfWeek];

  if (!daySchedule || daySchedule.length === 0) {
    return []; // No hay disponibilidad ese día
  }

  const slots = [];
  const { slotDuration, bufferTime } = availability;

  daySchedule.forEach(({ start, end }) => {
    const startTime = parseTime(start);
    const endTime = parseTime(end);

    let currentTime = startTime;

    while (currentTime + slotDuration <= endTime) {
      const slotStart = formatTime(currentTime);
      const slotEnd = formatTime(currentTime + slotDuration);

      // Verificar si el slot está ocupado
      const isBooked = existingBookings.some(booking => {
        return booking.date === formatDate(date) && booking.time === slotStart;
      });

      slots.push({
        start: slotStart,
        end: slotEnd,
        available: !isBooked,
      });

      currentTime += slotDuration + bufferTime;
    }
  });

  return slots;
};

/**
 * Validar si una reserva es posible
 */
export const validateBooking = (availability, date, time) => {
  const errors = [];

  // Validar fecha mínima
  const now = new Date();
  const bookingDate = new Date(date);
  const daysDiff = Math.ceil((bookingDate - now) / (1000 * 60 * 60 * 24));

  if (daysDiff < availability.minAdvanceBooking) {
    errors.push(`Debes reservar con al menos ${availability.minAdvanceBooking} día(s) de anticipación`);
  }

  // Validar fecha máxima
  if (daysDiff > availability.maxAdvanceBooking) {
    errors.push(`No puedes reservar con más de ${availability.maxAdvanceBooking} días de anticipación`);
  }

  // Validar día de la semana
  const dayOfWeek = getDayOfWeek(bookingDate);
  const daySchedule = availability.weeklySchedule[dayOfWeek];

  if (!daySchedule || daySchedule.length === 0) {
    errors.push('El profesor no está disponible ese día');
  }

  // Validar horario
  if (daySchedule && daySchedule.length > 0) {
    const timeInMinutes = parseTime(time);
    const isValidTime = daySchedule.some(({ start, end }) => {
      const startMinutes = parseTime(start);
      const endMinutes = parseTime(end);
      return timeInMinutes >= startMinutes && timeInMinutes < endMinutes;
    });

    if (!isValidTime) {
      errors.push('El horario seleccionado no está disponible');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validar cancelación
 */
export const validateCancellation = (availability, booking) => {
  if (!availability.allowCancellation) {
    return {
      valid: false,
      error: 'No se permiten cancelaciones',
    };
  }

  const now = new Date();
  const bookingDate = new Date(`${booking.date} ${booking.time}`);
  const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);

  if (hoursDiff < availability.cancellationDeadline) {
    return {
      valid: false,
      error: `No puedes cancelar con menos de ${availability.cancellationDeadline} horas de anticipación`,
    };
  }

  return { valid: true, error: null };
};

/**
 * Validar reprogramación
 */
export const validateRescheduling = (availability, booking) => {
  if (!availability.allowRescheduling) {
    return {
      valid: false,
      error: 'No se permiten reprogramaciones',
    };
  }

  const now = new Date();
  const bookingDate = new Date(`${booking.date} ${booking.time}`);
  const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);

  if (hoursDiff < availability.reschedulingDeadline) {
    return {
      valid: false,
      error: `No puedes reprogramar con menos de ${availability.reschedulingDeadline} horas de anticipación`,
    };
  }

  return { valid: true, error: null };
};

// Utilidades

const getDayOfWeek = (date) => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date(date).getDay()];
};

const parseTime = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
