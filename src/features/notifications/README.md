# Notifications Feature

Sistema completo de notificaciones por email con Resend y cron jobs en Vercel.

## Estructura

```
notifications/
  ├── hooks/
  │   └── useNotifications.js          # Hook para enviar notificaciones
  ├── services/
  │   ├── emailService.js              # Servicio de envío de emails
  │   └── notificationService.js       # Gestión de notificaciones programadas
  ├── templates/
  │   └── emailTemplates.js            # Templates HTML de emails
  └── index.js                         # Exportación centralizada
```

## Configuración

### 1. Obtener API Key de Resend

1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta
3. Ve a API Keys
4. Crea una nueva API key
5. Agrégala al `.env`:

```bash
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 2. Configurar dominio en Resend (Opcional)

Para producción, verifica tu dominio:
1. Ve a Domains en Resend
2. Agrega tu dominio
3. Configura los registros DNS
4. Actualiza `EMAIL_CONFIG.from` en `services/resend/config.js`

### 3. Variables de entorno para Vercel

En Vercel Dashboard > Settings > Environment Variables:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
CRON_SECRET=un-secret-aleatorio-seguro
```

## Uso

### Hook useNotifications

```jsx
import { useNotifications } from '@features/notifications';

function BookingPage() {
  const { sendBookingConfirmation, loading, error } = useNotifications();

  const handleBooking = async (bookingData) => {
    const result = await sendBookingConfirmation({
      bookingId: 'booking_123',
      userId: 'user_456',
      userEmail: 'user@example.com',
      userName: 'John Doe',
      productTitle: 'Clase de Inglés',
      teacherName: 'Jane Smith',
      bookingDate: '2024-01-15',
      bookingTime: '10:00 AM',
      duration: 60,
      price: 50,
      bookingDateTime: '2024-01-15T10:00:00Z',
    });

    if (result.success) {
      console.log('Notificación enviada!');
    }
  };

  return (
    <button onClick={handleBooking} disabled={loading}>
      Confirmar Reserva
    </button>
  );
}
```

### Servicios directos

```jsx
import {
  sendBookingConfirmation,
  sendReminder24Hours,
  sendReminderSameDay,
  sendWelcomeEmail,
} from '@features/notifications';

// Enviar confirmación
await sendBookingConfirmation(bookingData);

// Enviar recordatorio 24h
await sendReminder24Hours(bookingData);

// Enviar recordatorio mismo día
await sendReminderSameDay(bookingData);

// Enviar bienvenida
await sendWelcomeEmail({ userName, userEmail });
```

## Tipos de Emails

### 1. Confirmación de Reserva
- **Trigger**: Al crear una reserva
- **Envío**: Inmediato
- **Contenido**: Detalles de la reserva, profesor, fecha, hora

### 2. Recordatorio 24 horas
- **Trigger**: Automático (cron job)
- **Envío**: 24 horas antes de la clase
- **Contenido**: Recordatorio, consejos de preparación

### 3. Recordatorio mismo día
- **Trigger**: Automático (cron job)
- **Envío**: 2 horas antes de la clase
- **Contenido**: Recordatorio urgente, link de la clase

### 4. Cancelación
- **Trigger**: Al cancelar una reserva
- **Envío**: Inmediato
- **Contenido**: Confirmación de cancelación

### 5. Bienvenida
- **Trigger**: Al registrarse
- **Envío**: Inmediato
- **Contenido**: Bienvenida, primeros pasos

## Firestore Schema

### Collection: `notifications`

```javascript
{
  id: "auto_generated",
  type: "reminder_24h" | "reminder_same_day" | "booking_confirmation",
  bookingId: "booking_123",
  userId: "user_456",
  userEmail: "user@example.com",
  scheduledFor: "2024-01-14T10:00:00Z",
  sent: false,
  sentAt: null,
  emailId: null,
  cancelled: false,
  data: {
    userName: "John Doe",
    productTitle: "Clase de Inglés",
    teacherName: "Jane Smith",
    bookingDate: "15 de Enero, 2024",
    bookingTime: "10:00 AM",
    duration: 60,
    // ... más datos
  },
  createdAt: "2024-01-01T00:00:00Z"
}
```

## Cron Job (Vercel)

### Configuración

El archivo `vercel.json` configura el cron job:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```

**Schedule**: `0 * * * *` = Cada hora en punto

### Funcionamiento

1. Vercel ejecuta `/api/cron/send-reminders` cada hora
2. La función obtiene notificaciones pendientes de Firestore
3. Envía los emails correspondientes
4. Marca las notificaciones como enviadas

### Seguridad

El endpoint está protegido con un secret:

```javascript
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return res.status(401).json({ error: 'Unauthorized' });
}
```

### Logs

Ver logs en Vercel Dashboard > Deployments > Functions

## Flujo completo

### Al crear una reserva:

1. Usuario confirma reserva
2. Se crea documento en `bookings`
3. **Se envía email de confirmación inmediato**
4. Se crean 2 notificaciones programadas:
   - Recordatorio 24h antes
   - Recordatorio 2h antes
5. Cron job procesa las notificaciones en su momento

### Cron job (cada hora):

1. Busca notificaciones con `sent: false` y `scheduledFor <= now`
2. Envía cada email
3. Marca como `sent: true`
4. Registra `emailId` de Resend

## Testing

### Modo desarrollo (sin Resend)

Si no tienes API key configurada:
- Los emails no se envían
- Se muestra warning en consola
- La app sigue funcionando normalmente

### Testing local

```javascript
import { sendWelcomeEmail } from '@features/notifications';

// Probar email de bienvenida
const result = await sendWelcomeEmail({
  userName: 'Test User',
  userEmail: 'test@example.com',
});

console.log(result);
```

### Testing cron job local

No es posible ejecutar el cron localmente. Opciones:

1. **Deploy a Vercel** y ver logs
2. **Ejecutar función manualmente**:
   ```bash
   curl -X POST http://localhost:3000/api/cron/send-reminders \
     -H "Authorization: Bearer tu-secret"
   ```

## Personalización

### Modificar templates

Edita `templates/emailTemplates.js`:

```javascript
export const bookingConfirmationTemplate = ({ ... }) => {
  const content = `
    <div class="container">
      <!-- Tu HTML personalizado -->
    </div>
  `;
  return baseTemplate(content);
};
```

### Agregar nuevo tipo de email

1. Crear template en `emailTemplates.js`
2. Crear función en `emailService.js`
3. Exportar desde `index.js`

### Cambiar schedule del cron

Edita `vercel.json`:

```json
{
  "schedule": "*/30 * * * *"  // Cada 30 minutos
}
```

Formatos comunes:
- `0 * * * *` - Cada hora
- `*/30 * * * *` - Cada 30 minutos
- `0 9 * * *` - Diario a las 9 AM
- `0 0 * * 0` - Semanal (domingos a medianoche)

## Troubleshooting

### Emails no se envían

1. Verifica API key en `.env`
2. Verifica que no sea `demo_resend_key`
3. Revisa consola del navegador
4. Verifica límites de Resend (100 emails/día en plan free)

### Cron job no funciona

1. Verifica que esté deployado en Vercel
2. Revisa logs en Vercel Dashboard
3. Verifica variables de entorno en Vercel
4. Verifica que `CRON_SECRET` coincida

### Notificaciones duplicadas

1. Verifica que no haya múltiples cron jobs activos
2. Revisa campo `sent` en Firestore
3. Limpia notificaciones antiguas

## Límites y costos

### Resend (Plan Free)
- 100 emails/día
- 3,000 emails/mes
- Solo dominio `onboarding@resend.dev`

### Resend (Plan Pro - $20/mes)
- 50,000 emails/mes
- Dominios personalizados
- Webhooks
- Analytics

### Vercel
- Cron jobs incluidos en todos los planes
- Límite de ejecución: 10 segundos (Hobby), 60 segundos (Pro)

## Recursos

- [Resend Docs](https://resend.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
