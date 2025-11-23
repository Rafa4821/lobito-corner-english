/**
 * In-App Notification Service
 * Servicio para crear notificaciones in-app en Firestore
 */

import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Crear notificación in-app en Firestore
 */
const createInAppNotification = async (notificationData) => {
  try {
    const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
    const docRef = await addDoc(notificationsRef, {
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false,
    });

    return { notificationId: docRef.id, error: null };
  } catch (error) {
    console.error('Error creating in-app notification:', error);
    return { notificationId: null, error: error.message };
  }
};

/**
 * Notificar nueva grabación
 */
export const notifyNewRecording = async ({ studentId, teacherName, recordingTitle, recordingUrl }) => {
  return await createInAppNotification({
    type: 'new_recording',
    userId: studentId,
    data: {
      teacherName,
      recordingTitle,
      recordingUrl,
      message: `${teacherName} subió una nueva grabación: ${recordingTitle}`,
    },
  });
};

/**
 * Notificar nuevo mensaje
 */
export const notifyNewMessage = async ({ recipientId, senderName, messagePreview, chatUrl }) => {
  return await createInAppNotification({
    type: 'new_message',
    userId: recipientId,
    data: {
      senderName,
      messagePreview,
      chatUrl,
      message: `${senderName} te envió un mensaje`,
    },
  });
};

/**
 * Notificar nuevo post del blog
 */
export const notifyNewBlogPost = async ({ studentId, authorName, postTitle, postUrl }) => {
  return await createInAppNotification({
    type: 'new_blog_post',
    userId: studentId,
    data: {
      authorName,
      postTitle,
      postUrl,
      message: `${authorName} publicó: ${postTitle}`,
    },
  });
};

/**
 * Notificar clase reprogramada
 */
export const notifyBookingRescheduled = async ({ userId, teacherName, newDate, newTime, bookingUrl }) => {
  return await createInAppNotification({
    type: 'booking_rescheduled',
    userId,
    data: {
      teacherName,
      newDate,
      newTime,
      bookingUrl,
      message: `Tu clase con ${teacherName} fue reprogramada para el ${newDate} a las ${newTime}`,
    },
  });
};

/**
 * Notificar clase completada
 */
export const notifyClassCompleted = async ({ studentId, teacherName, productTitle, bookingUrl }) => {
  return await createInAppNotification({
    type: 'class_completed',
    userId: studentId,
    data: {
      teacherName,
      productTitle,
      bookingUrl,
      message: `Completaste tu clase de ${productTitle} con ${teacherName}`,
    },
  });
};

/**
 * Notificar confirmación de reserva (in-app)
 */
export const notifyBookingConfirmation = async ({ userId, teacherName, bookingDate, bookingTime }) => {
  return await createInAppNotification({
    type: 'booking_confirmation',
    userId,
    data: {
      teacherName,
      bookingDate,
      bookingTime,
      message: `Tu clase con ${teacherName} está confirmada para el ${bookingDate} a las ${bookingTime}`,
    },
  });
};
