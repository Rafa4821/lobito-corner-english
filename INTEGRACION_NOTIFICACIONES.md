# 🔔 Guía de Integración de Notificaciones

## ✅ Lo que se implementó

### 1. **Componentes UI**
- ✅ `NotificationBell` - Campana con dropdown en el Header
- ✅ `NotificationsPage` - Página completa de notificaciones
- ✅ Real-time updates con Firestore
- ✅ Badge con contador de no leídas
- ✅ Marcar como leída
- ✅ Eliminar notificaciones

### 2. **Nuevos Templates de Email**
- ✅ `newRecordingEmail` - Nueva grabación disponible
- ✅ `newMessageEmail` - Nuevo mensaje en chat
- ✅ `newBlogPostEmail` - Nuevo post del blog
- ✅ `bookingRescheduledEmail` - Clase reprogramada
- ✅ `classCompletedEmail` - Clase completada

### 3. **Servicios**
- ✅ `inAppNotificationService` - Crear notificaciones in-app
- ✅ Funciones helper para cada tipo de notificación
- ✅ Integración con Firestore

### 4. **Integración Visual**
- ✅ NotificationBell en el Header
- ✅ Link en el Sidebar
- ✅ Ruta `/notifications` en el router

## 📚 Cómo Integrar con Features Existentes

### 1. Recordings - Notificar cuando se sube una grabación

**Ubicación**: `src/features/recordings/services/recordingService.js`

```javascript
// Importar al inicio del archivo
import { 
  notifyNewRecording, 
  sendNewRecordingEmail 
} from '@features/notifications';

// Después de subir la grabación exitosamente:
export const uploadRecording = async (file, metadata) => {
  // ... código existente de upload ...
  
  // Después de obtener downloadURL:
  
  // 1. Crear notificación in-app
  await notifyNewRecording({
    studentId: metadata.studentId,
    teacherName: metadata.teacherName,
    recordingTitle: metadata.title,
    recordingUrl: downloadURL,
  });
  
  // 2. Enviar email (opcional)
  await sendNewRecordingEmail({
    studentName: metadata.studentName,
    studentEmail: metadata.studentEmail,
    teacherName: metadata.teacherName,
    recordingTitle: metadata.title,
    recordingDescription: metadata.description,
    recordingUrl: downloadURL,
  });
  
  return { success: true, url: downloadURL };
};
```

### 2. Chat - Notificar cuando hay un nuevo mensaje

**Ubicación**: `src/features/chat/services/chatService.js`

```javascript
// Importar al inicio del archivo
import { 
  notifyNewMessage, 
  sendNewMessageEmail 
} from '@features/notifications';

// Después de enviar el mensaje:
export const sendMessage = async (chatId, messageData) => {
  // ... código existente de envío ...
  
  // Obtener datos del destinatario
  const recipientId = messageData.recipientId;
  const recipientEmail = messageData.recipientEmail;
  const senderName = messageData.senderName;
  
  // 1. Crear notificación in-app
  await notifyNewMessage({
    recipientId,
    senderName,
    messagePreview: messageData.text.substring(0, 100),
    chatUrl: `/chat/${chatId}`,
  });
  
  // 2. Enviar email (opcional, solo si el usuario está offline)
  await sendNewMessageEmail({
    recipientName: messageData.recipientName,
    recipientEmail,
    senderName,
    messagePreview: messageData.text.substring(0, 100),
    chatUrl: `${window.location.origin}/chat/${chatId}`,
    senderRole: messageData.senderRole,
  });
  
  return { success: true };
};
```

### 3. Blog - Notificar cuando se publica un nuevo post

**Ubicación**: `src/features/blog/services/blogService.js`

```javascript
// Importar al inicio del archivo
import { 
  notifyNewBlogPost, 
  sendNewBlogPostEmail 
} from '@features/notifications';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/services/firebase';

// Después de publicar el post:
export const publishPost = async (postData) => {
  // ... código existente de publicación ...
  
  // Obtener todos los estudiantes del profesor
  const studentsQuery = query(
    collection(db, 'users'),
    where('role', '==', 'student'),
    where('teacherId', '==', postData.authorId) // Si tienes esta relación
  );
  
  const studentsSnapshot = await getDocs(studentsQuery);
  
  // Notificar a cada estudiante
  const notifications = [];
  studentsSnapshot.forEach((doc) => {
    const student = doc.data();
    
    // 1. Notificación in-app
    notifications.push(
      notifyNewBlogPost({
        studentId: doc.id,
        authorName: postData.authorName,
        postTitle: postData.title,
        postUrl: `/blog/${postData.id}`,
      })
    );
    
    // 2. Email (opcional)
    notifications.push(
      sendNewBlogPostEmail({
        userName: student.name,
        userEmail: student.email,
        authorName: postData.authorName,
        postTitle: postData.title,
        postExcerpt: postData.excerpt,
        postImage: postData.coverImage,
        postUrl: `${window.location.origin}/blog/${postData.id}`,
      })
    );
  });
  
  await Promise.all(notifications);
  
  return { success: true };
};
```

### 4. Bookings - Notificar cuando se reprograma una clase

**Ubicación**: `src/features/bookings/services/bookingService.js`

```javascript
// Importar al inicio del archivo
import { 
  notifyBookingRescheduled, 
  sendBookingRescheduledEmail 
} from '@features/notifications';

// Después de reprogramar:
export const rescheduleBooking = async (bookingId, newDate, newTime, reason) => {
  // ... código existente de reprogramación ...
  
  // Obtener datos de la reserva
  const booking = await getBooking(bookingId);
  
  // 1. Notificación in-app
  await notifyBookingRescheduled({
    userId: booking.studentId,
    teacherName: booking.teacherName,
    newDate,
    newTime,
    bookingUrl: `/bookings/${bookingId}`,
  });
  
  // 2. Email
  await sendBookingRescheduledEmail({
    userName: booking.studentName,
    userEmail: booking.studentEmail,
    teacherName: booking.teacherName,
    productTitle: booking.productTitle,
    newDate,
    newTime,
    duration: booking.duration,
    reason,
    bookingUrl: `${window.location.origin}/bookings/${bookingId}`,
  });
  
  return { success: true };
};
```

### 5. Bookings - Notificar cuando se completa una clase

**Ubicación**: `src/features/bookings/services/bookingService.js`

```javascript
// Importar al inicio del archivo
import { 
  notifyClassCompleted, 
  sendClassCompletedEmail 
} from '@features/notifications';

// Después de marcar como completada:
export const completeBooking = async (bookingId, feedback) => {
  // ... código existente ...
  
  const booking = await getBooking(bookingId);
  
  // 1. Notificación in-app
  await notifyClassCompleted({
    studentId: booking.studentId,
    teacherName: booking.teacherName,
    productTitle: booking.productTitle,
    bookingUrl: `/bookings/${bookingId}`,
  });
  
  // 2. Email
  await sendClassCompletedEmail({
    studentName: booking.studentName,
    studentEmail: booking.studentEmail,
    teacherName: booking.teacherName,
    productTitle: booking.productTitle,
    bookingDate: booking.date,
    duration: booking.duration,
    feedback,
    bookingUrl: `${window.location.origin}/bookings/${bookingId}`,
  });
  
  return { success: true };
};
```

## 🎯 Funciones Disponibles

### In-App Notifications (Firestore)

```javascript
import {
  notifyNewRecording,
  notifyNewMessage,
  notifyNewBlogPost,
  notifyBookingRescheduled,
  notifyClassCompleted,
  notifyBookingConfirmation,
} from '@features/notifications';
```

### Email Notifications (Resend)

```javascript
import {
  sendNewRecordingEmail,
  sendNewMessageEmail,
  sendNewBlogPostEmail,
  sendBookingRescheduledEmail,
  sendClassCompletedEmail,
} from '@features/notifications';
```

## 📊 Esquema de Firestore

### Collection: `notifications`

```javascript
{
  id: "auto-generated",
  type: "new_recording" | "new_message" | "new_blog_post" | "booking_rescheduled" | "class_completed" | "booking_confirmation",
  userId: "user_id",
  data: {
    // Datos específicos del tipo de notificación
    message: "Mensaje descriptivo",
    // ... otros campos
  },
  createdAt: "2024-01-15T10:00:00.000Z",
  read: false,
  readAt: null // o timestamp cuando se marca como leída
}
```

## ✅ Checklist de Integración

### Recordings
- [ ] Importar funciones de notificaciones
- [ ] Llamar `notifyNewRecording` después de subir
- [ ] Llamar `sendNewRecordingEmail` (opcional)
- [ ] Probar que aparece en NotificationBell
- [ ] Probar que llega el email

### Chat
- [ ] Importar funciones de notificaciones
- [ ] Llamar `notifyNewMessage` al enviar mensaje
- [ ] Llamar `sendNewMessageEmail` si usuario offline
- [ ] Probar notificaciones en tiempo real

### Blog
- [ ] Importar funciones de notificaciones
- [ ] Obtener lista de estudiantes
- [ ] Llamar `notifyNewBlogPost` para cada estudiante
- [ ] Llamar `sendNewBlogPostEmail` (opcional)
- [ ] Probar con múltiples estudiantes

### Bookings
- [ ] Importar funciones de notificaciones
- [ ] Notificar en reprogramación
- [ ] Notificar en completación
- [ ] Probar flujo completo

## 🚀 Próximos Pasos Opcionales

### 1. Preferencias de Usuario
Crear página `/settings/notifications` donde el usuario pueda:
- Activar/desactivar cada tipo de notificación
- Elegir recibir solo in-app o también emails
- Configurar frecuencia (inmediato, diario, semanal)

### 2. Notificaciones Push
Implementar Firebase Cloud Messaging (FCM) para:
- Notificaciones push del navegador
- Notificaciones en dispositivos móviles

### 3. Agrupación de Notificaciones
- Agrupar notificaciones similares
- "3 nuevos mensajes de Juan"
- "5 nuevas grabaciones esta semana"

### 4. Acciones Rápidas
- Responder mensaje desde la notificación
- Marcar grabación como vista
- Aceptar/rechazar reprogramación

## 📝 Notas Importantes

1. **Performance**: Las notificaciones in-app usan real-time listeners, asegúrate de limpiar los listeners cuando el componente se desmonte.

2. **Emails**: Los emails son opcionales. Considera enviarlos solo si:
   - El usuario está offline
   - Es una notificación importante (recordatorios, cambios)
   - El usuario tiene habilitadas las notificaciones por email

3. **Privacidad**: Solo envía notificaciones a usuarios que tienen relación con el evento (estudiante del profesor, participantes del chat, etc.)

4. **Testing**: Prueba en modo desarrollo antes de enviar emails reales. Usa emails de prueba.

## 🎉 Resultado Final

Con esta integración tendrás:
- ✅ Notificaciones in-app en tiempo real
- ✅ Campana con contador en el Header
- ✅ Página completa de notificaciones
- ✅ Emails profesionales para eventos importantes
- ✅ Sistema escalable y mantenible
- ✅ Experiencia de usuario mejorada

¡El módulo de notificaciones está completo y listo para usar!
