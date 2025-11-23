/**
 * Vercel Serverless Function - Send Reminders
 * Cron job para enviar recordatorios automáticos
 * 
 * Se ejecuta cada hora para procesar notificaciones pendientes
 */

import { Resend } from 'resend';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Inicializar Firebase Admin (solo una vez)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Templates de email (versión simplificada para serverless)
 */
const getEmailTemplate = (type, data) => {
  const templates = {
    reminder_24h: {
      subject: '⏰ Recordatorio: Tu clase es mañana - Lobito Corner',
      html: `
        <h1>Tu clase es mañana</h1>
        <p>Hola ${data.userName},</p>
        <p>Este es un recordatorio de que tu clase está programada para mañana.</p>
        <p><strong>Clase:</strong> ${data.productTitle}</p>
        <p><strong>Profesor:</strong> ${data.teacherName}</p>
        <p><strong>Fecha:</strong> ${data.bookingDate}</p>
        <p><strong>Hora:</strong> ${data.bookingTime}</p>
      `,
    },
    reminder_same_day: {
      subject: '🔔 ¡Tu clase es HOY! - Lobito Corner',
      html: `
        <h1>¡Tu clase es HOY!</h1>
        <p>Hola ${data.userName},</p>
        <p>Tu clase comienza hoy a las ${data.bookingTime}.</p>
        <p><strong>Clase:</strong> ${data.productTitle}</p>
        <p><strong>Profesor:</strong> ${data.teacherName}</p>
        <p><strong>Hora:</strong> ${data.bookingTime}</p>
      `,
    },
  };

  return templates[type] || templates.reminder_24h;
};

/**
 * Obtener notificaciones pendientes
 */
const getPendingNotifications = async () => {
  const now = new Date().toISOString();
  const notificationsRef = db.collection('notifications');
  
  const snapshot = await notificationsRef
    .where('sent', '==', false)
    .where('scheduledFor', '<=', now)
    .limit(50) // Procesar máximo 50 por ejecución
    .get();

  const notifications = [];
  snapshot.forEach((doc) => {
    notifications.push({ id: doc.id, ...doc.data() });
  });

  return notifications;
};

/**
 * Enviar email
 */
const sendEmail = async (notification) => {
  const template = getEmailTemplate(notification.type, notification.data);
  
  const { data, error } = await resend.emails.send({
    from: 'Lobito Corner <onboarding@resend.dev>',
    to: notification.userEmail,
    subject: template.subject,
    html: template.html,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
};

/**
 * Marcar notificación como enviada
 */
const markAsSent = async (notificationId, emailId) => {
  await db.collection('notifications').doc(notificationId).update({
    sent: true,
    sentAt: new Date().toISOString(),
    emailId,
  });
};

/**
 * Handler principal
 */
export default async function handler(req, res) {
  // Verificar que sea una petición autorizada (cron job de Vercel)
  const authHeader = req.headers.authorization;
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting reminder cron job...');
    
    // Obtener notificaciones pendientes
    const notifications = await getPendingNotifications();
    console.log(`📧 Found ${notifications.length} pending notifications`);

    let processed = 0;
    const errors = [];

    // Procesar cada notificación
    for (const notification of notifications) {
      try {
        const emailId = await sendEmail(notification);
        await markAsSent(notification.id, emailId);
        processed++;
        console.log(`✅ Sent notification ${notification.id}`);
      } catch (error) {
        console.error(`❌ Error sending notification ${notification.id}:`, error);
        errors.push({
          notificationId: notification.id,
          error: error.message,
        });
      }
    }

    console.log(`✅ Cron job completed. Processed: ${processed}/${notifications.length}`);

    return res.status(200).json({
      success: true,
      processed,
      total: notifications.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('❌ Cron job error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
