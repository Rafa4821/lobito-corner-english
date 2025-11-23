/**
 * Email Service
 * Servicio para envío de emails con Resend
 */

import { resend, EMAIL_CONFIG } from '@/services/resend';
import {
  bookingConfirmationTemplate,
  reminder24HoursTemplate,
  reminderSameDayTemplate,
  bookingCancellationTemplate,
  welcomeEmailTemplate,
} from '../templates/emailTemplates';

/**
 * Enviar email de confirmación de reserva
 */
export const sendBookingConfirmation = async (bookingData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: bookingData.userEmail,
      subject: '✅ Reserva Confirmada - Lobito Corner',
      html: bookingConfirmationTemplate({
        userName: bookingData.userName,
        productTitle: bookingData.productTitle,
        teacherName: bookingData.teacherName,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        duration: bookingData.duration,
        price: bookingData.price,
        bookingId: bookingData.bookingId,
      }),
    });

    if (error) {
      console.error('Error sending booking confirmation:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Booking confirmation sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error sending booking confirmation:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar recordatorio 24 horas antes
 */
export const sendReminder24Hours = async (bookingData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: bookingData.userEmail,
      subject: '⏰ Recordatorio: Tu clase es mañana - Lobito Corner',
      html: reminder24HoursTemplate({
        userName: bookingData.userName,
        productTitle: bookingData.productTitle,
        teacherName: bookingData.teacherName,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        duration: bookingData.duration,
        bookingId: bookingData.bookingId,
      }),
    });

    if (error) {
      console.error('Error sending 24h reminder:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ 24h reminder sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error sending 24h reminder:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar recordatorio el mismo día
 */
export const sendReminderSameDay = async (bookingData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: bookingData.userEmail,
      subject: '🔔 ¡Tu clase es HOY! - Lobito Corner',
      html: reminderSameDayTemplate({
        userName: bookingData.userName,
        productTitle: bookingData.productTitle,
        teacherName: bookingData.teacherName,
        bookingTime: bookingData.bookingTime,
        duration: bookingData.duration,
        bookingId: bookingData.bookingId,
        meetingLink: bookingData.meetingLink,
      }),
    });

    if (error) {
      console.error('Error sending same day reminder:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Same day reminder sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error sending same day reminder:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de cancelación
 */
export const sendBookingCancellation = async (bookingData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: bookingData.userEmail,
      subject: '❌ Reserva Cancelada - Lobito Corner',
      html: bookingCancellationTemplate({
        userName: bookingData.userName,
        productTitle: bookingData.productTitle,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        reason: bookingData.reason,
      }),
    });

    if (error) {
      console.error('Error sending cancellation email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Cancellation email sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de bienvenida
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: userData.userEmail,
      subject: '🎉 ¡Bienvenido a Lobito Corner!',
      html: welcomeEmailTemplate({
        userName: userData.userName,
        userEmail: userData.userEmail,
      }),
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Welcome email sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email genérico
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent:', data.id);
    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de nueva grabación
 */
export const sendNewRecordingEmail = async (data) => {
  const { newRecordingEmail } = await import('../templates/emailTemplates');
  
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.studentEmail,
      subject: `📹 Nueva grabación disponible: ${data.recordingTitle}`,
      html: newRecordingEmail(data),
    });

    if (error) {
      console.error('Error sending new recording email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ New recording email sent:', emailData.id);
    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending new recording email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de nuevo mensaje
 */
export const sendNewMessageEmail = async (data) => {
  const { newMessageEmail } = await import('../templates/emailTemplates');
  
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.recipientEmail,
      subject: `💬 Nuevo mensaje de ${data.senderName}`,
      html: newMessageEmail(data),
    });

    if (error) {
      console.error('Error sending new message email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ New message email sent:', emailData.id);
    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending new message email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de nuevo post del blog
 */
export const sendNewBlogPostEmail = async (data) => {
  const { newBlogPostEmail } = await import('../templates/emailTemplates');
  
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.userEmail,
      subject: `📝 Nuevo post: ${data.postTitle}`,
      html: newBlogPostEmail(data),
    });

    if (error) {
      console.error('Error sending new blog post email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ New blog post email sent:', emailData.id);
    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending new blog post email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de clase reprogramada
 */
export const sendBookingRescheduledEmail = async (data) => {
  const { bookingRescheduledEmail } = await import('../templates/emailTemplates');
  
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.userEmail,
      subject: '📅 Tu clase ha sido reprogramada',
      html: bookingRescheduledEmail(data),
    });

    if (error) {
      console.error('Error sending rescheduled email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Rescheduled email sent:', emailData.id);
    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending rescheduled email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Enviar email de clase completada
 */
export const sendClassCompletedEmail = async (data) => {
  const { classCompletedEmail } = await import('../templates/emailTemplates');
  
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to: data.studentEmail,
      subject: '🎓 Clase completada',
      html: classCompletedEmail(data),
    });

    if (error) {
      console.error('Error sending class completed email:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Class completed email sent:', emailData.id);
    return { success: true, emailId: emailData.id };
  } catch (error) {
    console.error('Error sending class completed email:', error);
    return { success: false, error: error.message };
  }
};
