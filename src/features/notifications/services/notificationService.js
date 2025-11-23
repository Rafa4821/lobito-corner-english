/**
 * Notification Service
 * Servicio para gestionar notificaciones automáticas
 */

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import {
  sendBookingConfirmation,
  sendReminder24Hours,
  sendReminderSameDay,
} from './emailService';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Crear notificación en Firestore
 */
export const createNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
    const docRef = await addDoc(notificationsRef, {
      ...notificationData,
      createdAt: new Date().toISOString(),
      sent: false,
    });

    return { notificationId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { notificationId: null, error: error.message };
  }
};

/**
 * Programar notificaciones para una reserva
 */
export const scheduleBookingNotifications = async (bookingData) => {
  try {
    const bookingDateTime = new Date(bookingData.bookingDateTime);
    
    // Calcular fechas de envío
    const reminder24h = new Date(bookingDateTime);
    reminder24h.setHours(reminder24h.getHours() - 24);
    
    const reminderSameDay = new Date(bookingDateTime);
    reminderSameDay.setHours(reminderSameDay.getHours() - 2); // 2 horas antes

    // Crear notificaciones programadas
    const notifications = [
      {
        type: 'reminder_24h',
        bookingId: bookingData.bookingId,
        userId: bookingData.userId,
        userEmail: bookingData.userEmail,
        scheduledFor: reminder24h.toISOString(),
        data: bookingData,
      },
      {
        type: 'reminder_same_day',
        bookingId: bookingData.bookingId,
        userId: bookingData.userId,
        userEmail: bookingData.userEmail,
        scheduledFor: reminderSameDay.toISOString(),
        data: bookingData,
      },
    ];

    const results = [];
    for (const notification of notifications) {
      const result = await createNotification(notification);
      results.push(result);
    }

    return { success: true, notifications: results };
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar notificación de confirmación inmediata
 */
export const sendBookingConfirmationNotification = async (bookingData) => {
  try {
    // Enviar email de confirmación
    const result = await sendBookingConfirmation(bookingData);
    
    if (result.success) {
      // Registrar en Firestore
      await createNotification({
        type: 'booking_confirmation',
        bookingId: bookingData.bookingId,
        userId: bookingData.userId,
        userEmail: bookingData.userEmail,
        emailId: result.emailId,
        sent: true,
        sentAt: new Date().toISOString(),
        data: bookingData,
      });
    }

    return result;
  } catch (error) {
    console.error('Error sending booking confirmation notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtener notificaciones pendientes
 */
export const getPendingNotifications = async () => {
  try {
    const now = new Date().toISOString();
    const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
    
    const q = query(
      notificationsRef,
      where('sent', '==', false),
      where('scheduledFor', '<=', now)
    );
    
    const querySnapshot = await getDocs(q);
    const notifications = [];
    
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });

    return { notifications, error: null };
  } catch (error) {
    console.error('Error getting pending notifications:', error);
    return { notifications: [], error: error.message };
  }
};

/**
 * Procesar notificaciones pendientes
 */
export const processPendingNotifications = async () => {
  try {
    const { notifications, error } = await getPendingNotifications();
    
    if (error) {
      return { processed: 0, errors: [error] };
    }

    let processed = 0;
    const errors = [];

    for (const notification of notifications) {
      try {
        let result;

        // Enviar según el tipo
        switch (notification.type) {
          case 'reminder_24h':
            result = await sendReminder24Hours(notification.data);
            break;
          case 'reminder_same_day':
            result = await sendReminderSameDay(notification.data);
            break;
          default:
            console.warn('Unknown notification type:', notification.type);
            continue;
        }

        // Marcar como enviada
        if (result.success) {
          const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
          await updateDoc(notificationRef, {
            sent: true,
            sentAt: new Date().toISOString(),
            emailId: result.emailId,
          });
          processed++;
        } else {
          errors.push({
            notificationId: notification.id,
            error: result.error,
          });
        }
      } catch (error) {
        console.error('Error processing notification:', notification.id, error);
        errors.push({
          notificationId: notification.id,
          error: error.message,
        });
      }
    }

    return { processed, errors, total: notifications.length };
  } catch (error) {
    console.error('Error processing pending notifications:', error);
    return { processed: 0, errors: [error.message], total: 0 };
  }
};

/**
 * Cancelar notificaciones de una reserva
 */
export const cancelBookingNotifications = async (bookingId) => {
  try {
    const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(
      notificationsRef,
      where('bookingId', '==', bookingId),
      where('sent', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const promises = [];
    querySnapshot.forEach((docSnapshot) => {
      const notificationRef = doc(db, NOTIFICATIONS_COLLECTION, docSnapshot.id);
      promises.push(
        updateDoc(notificationRef, {
          cancelled: true,
          cancelledAt: new Date().toISOString(),
        })
      );
    });

    await Promise.all(promises);
    
    return { success: true, cancelled: promises.length };
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    return { success: false, error: error.message };
  }
};
