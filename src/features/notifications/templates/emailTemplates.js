/**
 * Email Templates
 * Templates HTML para emails de notificaciones
 */

/**
 * Template base con estilos
 */
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lobito Corner</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #667eea;
      font-size: 24px;
      margin-top: 0;
    }
    .content p {
      margin: 16px 0;
      color: #555;
    }
    .booking-details {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .booking-details p {
      margin: 8px 0;
      font-size: 15px;
    }
    .booking-details strong {
      color: #333;
      font-weight: 600;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      opacity: 0.9;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 30px;
      text-align: center;
      color: #777;
      font-size: 14px;
      border-top: 1px solid #e9ecef;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .emoji {
      font-size: 48px;
      margin: 20px 0;
    }
    .highlight {
      background-color: #fff3cd;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>
`;

/**
 * Email de confirmación de reserva
 */
export const bookingConfirmationTemplate = ({
  userName,
  productTitle,
  teacherName,
  bookingDate,
  bookingTime,
  duration,
  price,
  bookingId,
}) => {
  const content = `
    <div class="container">
      <div class="header">
        <h1>📚 Lobito Corner</h1>
      </div>
      <div class="content">
        <div class="emoji">✅</div>
        <h2>¡Reserva Confirmada!</h2>
        <p>Hola <strong>${userName}</strong>,</p>
        <p>Tu clase ha sido reservada exitosamente. Estamos emocionados de verte pronto.</p>
        
        <div class="booking-details">
          <p><strong>📚 Clase:</strong> ${productTitle}</p>
          <p><strong>👨‍🏫 Profesor:</strong> ${teacherName}</p>
          <p><strong>📅 Fecha:</strong> ${bookingDate}</p>
          <p><strong>🕐 Hora:</strong> ${bookingTime}</p>
          <p><strong>⏱️ Duración:</strong> ${duration} minutos</p>
          <p><strong>💰 Precio:</strong> $${price} USD</p>
          <p><strong>🔖 ID de Reserva:</strong> ${bookingId}</p>
        </div>

        <p>Recibirás recordatorios automáticos:</p>
        <ul>
          <li>📧 24 horas antes de tu clase</li>
          <li>📧 El mismo día de tu clase</li>
        </ul>

        <p style="margin-top: 30px;">
          <a href="https://tu-dominio.com/bookings/${bookingId}" class="button">
            Ver Detalles de la Reserva
          </a>
        </p>

        <p style="margin-top: 30px; color: #777; font-size: 14px;">
          Si necesitas cancelar o reprogramar, puedes hacerlo desde tu panel de reservas.
        </p>
      </div>
      <div class="footer">
        <p>¿Tienes preguntas? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
        <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Email de recordatorio 24 horas antes
 */
export const reminder24HoursTemplate = ({
  userName,
  productTitle,
  teacherName,
  bookingDate,
  bookingTime,
  duration,
  bookingId,
}) => {
  const content = `
    <div class="container">
      <div class="header">
        <h1>📚 Lobito Corner</h1>
      </div>
      <div class="content">
        <div class="emoji">⏰</div>
        <h2>Recordatorio: Tu clase es mañana</h2>
        <p>Hola <strong>${userName}</strong>,</p>
        <p>Este es un recordatorio amigable de que tu clase está programada para <span class="highlight">mañana</span>.</p>
        
        <div class="booking-details">
          <p><strong>📚 Clase:</strong> ${productTitle}</p>
          <p><strong>👨‍🏫 Profesor:</strong> ${teacherName}</p>
          <p><strong>📅 Fecha:</strong> ${bookingDate}</p>
          <p><strong>🕐 Hora:</strong> ${bookingTime}</p>
          <p><strong>⏱️ Duración:</strong> ${duration} minutos</p>
        </div>

        <p><strong>Consejos para prepararte:</strong></p>
        <ul>
          <li>✅ Revisa los materiales del curso</li>
          <li>✅ Prepara tus preguntas</li>
          <li>✅ Verifica tu conexión a internet</li>
          <li>✅ Ten listo tu micrófono y cámara</li>
        </ul>

        <p style="margin-top: 30px;">
          <a href="https://tu-dominio.com/bookings/${bookingId}" class="button">
            Ver Detalles
          </a>
        </p>

        <p style="margin-top: 30px; color: #777; font-size: 14px;">
          ¿Necesitas reprogramar? Puedes hacerlo desde tu panel de reservas.
        </p>
      </div>
      <div class="footer">
        <p>¿Tienes preguntas? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
        <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Email de recordatorio el mismo día
 */
export const reminderSameDayTemplate = ({
  userName,
  productTitle,
  teacherName,
  bookingTime,
  duration,
  bookingId,
  meetingLink,
}) => {
  const content = `
    <div class="container">
      <div class="header">
        <h1>📚 Lobito Corner</h1>
      </div>
      <div class="content">
        <div class="emoji">🔔</div>
        <h2>¡Tu clase es HOY!</h2>
        <p>Hola <strong>${userName}</strong>,</p>
        <p>Tu clase comienza <span class="highlight">hoy a las ${bookingTime}</span>. ¡Nos vemos pronto!</p>
        
        <div class="booking-details">
          <p><strong>📚 Clase:</strong> ${productTitle}</p>
          <p><strong>👨‍🏫 Profesor:</strong> ${teacherName}</p>
          <p><strong>🕐 Hora:</strong> ${bookingTime}</p>
          <p><strong>⏱️ Duración:</strong> ${duration} minutos</p>
        </div>

        <p><strong>Checklist de último minuto:</strong></p>
        <ul>
          <li>✅ Conexión a internet estable</li>
          <li>✅ Micrófono y cámara funcionando</li>
          <li>✅ Espacio tranquilo y sin distracciones</li>
          <li>✅ Materiales listos</li>
        </ul>

        ${meetingLink ? `
          <p style="margin-top: 30px;">
            <a href="${meetingLink}" class="button">
              🎥 Unirse a la Clase
            </a>
          </p>
        ` : `
          <p style="margin-top: 30px;">
            <a href="https://tu-dominio.com/bookings/${bookingId}" class="button">
              Ver Detalles
            </a>
          </p>
        `}

        <p style="margin-top: 30px; color: #777; font-size: 14px;">
          Te recomendamos unirte 5 minutos antes para verificar tu conexión.
        </p>
      </div>
      <div class="footer">
        <p>¿Problemas técnicos? <a href="mailto:support@lobitoCorner.com">Contáctanos de inmediato</a></p>
        <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Email de cancelación de reserva
 */
export const bookingCancellationTemplate = ({
  userName,
  productTitle,
  bookingDate,
  bookingTime,
  reason,
}) => {
  const content = `
    <div class="container">
      <div class="header">
        <h1>📚 Lobito Corner</h1>
      </div>
      <div class="content">
        <div class="emoji">❌</div>
        <h2>Reserva Cancelada</h2>
        <p>Hola <strong>${userName}</strong>,</p>
        <p>Tu reserva ha sido cancelada exitosamente.</p>
        
        <div class="booking-details">
          <p><strong>📚 Clase:</strong> ${productTitle}</p>
          <p><strong>📅 Fecha:</strong> ${bookingDate}</p>
          <p><strong>🕐 Hora:</strong> ${bookingTime}</p>
          ${reason ? `<p><strong>📝 Motivo:</strong> ${reason}</p>` : ''}
        </div>

        <p>Esperamos verte pronto en otra clase. Puedes explorar nuestro catálogo y hacer una nueva reserva cuando quieras.</p>

        <p style="margin-top: 30px;">
          <a href="https://tu-dominio.com/products" class="button">
            Explorar Clases
          </a>
        </p>
      </div>
      <div class="footer">
        <p>¿Tienes preguntas? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
        <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Email de bienvenida
 */
export const welcomeEmailTemplate = ({ userName, userEmail }) => {
  const content = `
    <div class="container">
      <div class="header">
        <h1>📚 Lobito Corner</h1>
      </div>
      <div class="content">
        <div class="emoji">🎉</div>
        <h2>¡Bienvenido a Lobito Corner!</h2>
        <p>Hola <strong>${userName}</strong>,</p>
        <p>Estamos emocionados de tenerte con nosotros. Tu cuenta ha sido creada exitosamente.</p>
        
        <div class="booking-details">
          <p><strong>📧 Email:</strong> ${userEmail}</p>
          <p><strong>✅ Estado:</strong> Cuenta activa</p>
        </div>

        <p><strong>¿Qué puedes hacer ahora?</strong></p>
        <ul>
          <li>🔍 Explorar nuestro catálogo de clases</li>
          <li>📅 Reservar tu primera clase</li>
          <li>👤 Completar tu perfil</li>
          <li>💬 Contactar a nuestros profesores</li>
        </ul>

        <p style="margin-top: 30px;">
          <a href="https://tu-dominio.com/products" class="button">
            Explorar Clases
          </a>
        </p>

        <p style="margin-top: 30px; color: #777; font-size: 14px;">
          Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte!
        </p>
      </div>
      <div class="footer">
        <p>¿Necesitas ayuda? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
        <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Template para nueva grabación disponible
 */
export const newRecordingEmail = (data) => {
  const content = `
    <div class="content">
      <h2>📹 Nueva Grabación Disponible</h2>
      <p>Hola <strong>${data.studentName}</strong>,</p>
      <p>
        Tu profesor <strong>${data.teacherName}</strong> ha subido una nueva grabación de tu clase:
      </p>
      <div class="highlight">
        <h3>${data.recordingTitle}</h3>
        ${data.recordingDescription ? `<p>${data.recordingDescription}</p>` : ''}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.recordingUrl}" class="button">Ver Grabación</a>
      </div>
      <p style="margin-top: 30px; color: #777; font-size: 14px;">
        Puedes ver esta grabación en cualquier momento desde tu panel de estudiante.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas ayuda? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
      <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Template para nuevo mensaje en chat
 */
export const newMessageEmail = (data) => {
  const content = `
    <div class="content">
      <h2>💬 Nuevo Mensaje</h2>
      <p>Hola <strong>${data.recipientName}</strong>,</p>
      <p>
        <strong>${data.senderName}</strong> te ha enviado un mensaje:
      </p>
      <div class="highlight">
        <p style="font-style: italic;">"${data.messagePreview}"</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.chatUrl}" class="button">Responder Mensaje</a>
      </div>
      <p style="margin-top: 30px; color: #777; font-size: 14px;">
        Mantén la comunicación fluida con tu ${data.senderRole === 'teacher' ? 'profesor' : 'estudiante'}.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas ayuda? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
      <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Template para nuevo post del blog
 */
export const newBlogPostEmail = (data) => {
  const content = `
    <div class="content">
      <h2>📝 Nuevo Post del Blog</h2>
      <p>Hola <strong>${data.userName}</strong>,</p>
      <p>
        Tu profesor <strong>${data.authorName}</strong> ha publicado un nuevo post:
      </p>
      <div class="highlight">
        <h3>${data.postTitle}</h3>
        <p>${data.postExcerpt}</p>
        ${data.postImage ? `<img src="${data.postImage}" alt="${data.postTitle}" style="max-width: 100%; border-radius: 8px; margin-top: 15px;">` : ''}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.postUrl}" class="button">Leer Post Completo</a>
      </div>
      <p style="margin-top: 30px; color: #777; font-size: 14px;">
        Mantente al día con los últimos consejos y recursos de tu profesor.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas ayuda? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
      <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Template para clase reprogramada
 */
export const bookingRescheduledEmail = (data) => {
  const content = `
    <div class="content">
      <h2>📅 Clase Reprogramada</h2>
      <p>Hola <strong>${data.userName}</strong>,</p>
      <p>
        Tu clase con <strong>${data.teacherName}</strong> ha sido reprogramada.
      </p>
      <div class="highlight">
        <h3>Detalles de la Nueva Fecha</h3>
        <p><strong>Clase:</strong> ${data.productTitle}</p>
        <p><strong>Nueva Fecha:</strong> ${data.newDate}</p>
        <p><strong>Nueva Hora:</strong> ${data.newTime}</p>
        <p><strong>Duración:</strong> ${data.duration} minutos</p>
        ${data.reason ? `<p><strong>Motivo:</strong> ${data.reason}</p>` : ''}
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.bookingUrl}" class="button">Ver Detalles</a>
      </div>
      <p style="margin-top: 30px; color: #777; font-size: 14px;">
        Si tienes alguna pregunta sobre el cambio, no dudes en contactar a tu profesor.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas ayuda? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
      <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
    </div>
  `;
  
  return baseTemplate(content);
};

/**
 * Template para clase completada
 */
export const classCompletedEmail = (data) => {
  const content = `
    <div class="content">
      <h2>🎓 Clase Completada</h2>
      <p>Hola <strong>${data.studentName}</strong>,</p>
      <p>
        ¡Felicitaciones! Has completado tu clase con <strong>${data.teacherName}</strong>.
      </p>
      <div class="highlight">
        <h3>Resumen de la Clase</h3>
        <p><strong>Clase:</strong> ${data.productTitle}</p>
        <p><strong>Fecha:</strong> ${data.bookingDate}</p>
        <p><strong>Duración:</strong> ${data.duration} minutos</p>
      </div>
      ${data.feedback ? `
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #667eea;">Comentarios del Profesor</h4>
          <p style="margin: 0;">${data.feedback}</p>
        </div>
      ` : ''}
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.bookingUrl}" class="button">Ver Detalles</a>
      </div>
      <p style="margin-top: 30px; color: #777; font-size: 14px;">
        ¿Qué te pareció la clase? Tu feedback es importante para nosotros.
      </p>
    </div>
    <div class="footer">
      <p>¿Necesitas ayuda? <a href="mailto:support@lobitoCorner.com">Contáctanos</a></p>
      <p>© 2024 Lobito Corner. Todos los derechos reservados.</p>
    </div>
  `;
  
  return baseTemplate(content);
};
