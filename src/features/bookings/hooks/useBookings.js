/**
 * useBookings Hooks
 * Hooks personalizados para gestionar reservas
 */

import { useState, useEffect } from 'react';
import {
  getStudentBookings,
  getTeacherBookings,
  getBookingById,
  getUpcomingBookings,
} from '../services/bookingService';

/**
 * Hook para obtener reservas de un estudiante
 */
export const useStudentBookings = (studentId, filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { bookings: data, error: err } = await getStudentBookings(studentId, filters);

    if (err) {
      setError(err);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [studentId, JSON.stringify(filters)]);

  return { bookings, loading, error, refetch: fetchBookings };
};

/**
 * Hook para obtener reservas de un profesor
 */
export const useTeacherBookings = (teacherId, filters = {}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!teacherId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { bookings: data, error: err } = await getTeacherBookings(teacherId, filters);

    if (err) {
      setError(err);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [teacherId, JSON.stringify(filters)]);

  return { bookings, loading, error, refetch: fetchBookings };
};

/**
 * Hook para obtener una reserva específica
 */
export const useBooking = (bookingId) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const { booking: data, error: err } = await getBookingById(bookingId);

      if (err) {
        setError(err);
      } else {
        setBooking(data);
      }

      setLoading(false);
    };

    fetchBooking();
  }, [bookingId]);

  return { booking, loading, error };
};

/**
 * Hook para obtener próximas reservas
 */
export const useUpcomingBookings = (userId, role) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!userId || !role) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const { bookings: data, error: err } = await getUpcomingBookings(userId, role);

    if (err) {
      setError(err);
    } else {
      setBookings(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [userId, role]);

  return { bookings, loading, error, refetch: fetchBookings };
};
