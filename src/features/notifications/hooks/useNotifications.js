/**
 * useNotifications Hook
 * Hook para gestionar notificaciones
 */

import { useState } from 'react';
import {
  sendBookingConfirmationNotification,
  scheduleBookingNotifications,
  cancelBookingNotifications,
} from '../services/notificationService';
import { sendWelcomeEmail } from '../services/emailService';

/**
 * Hook para enviar notificaciones
 */
export const useNotifications = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Enviar notificación de confirmación de reserva
   */
  const sendBookingConfirmation = async (bookingData) => {
    setLoading(true);
    setError(null);

    try {
      // Enviar confirmación inmediata
      const confirmationResult = await sendBookingConfirmationNotification(bookingData);
      
      if (!confirmationResult.success) {
        throw new Error(confirmationResult.error);
      }

      // Programar recordatorios
      const schedulingResult = await scheduleBookingNotifications(bookingData);
      
      if (!schedulingResult.success) {
        console.warn('Error scheduling reminders:', schedulingResult.error);
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Cancelar notificaciones de una reserva
   */
  const cancelNotifications = async (bookingId) => {
    setLoading(true);
    setError(null);

    try {
      const result = await cancelBookingNotifications(bookingId);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setLoading(false);
      return { success: true, cancelled: result.cancelled };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  /**
   * Enviar email de bienvenida
   */
  const sendWelcome = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await sendWelcomeEmail(userData);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return {
    loading,
    error,
    sendBookingConfirmation,
    cancelNotifications,
    sendWelcome,
  };
};
