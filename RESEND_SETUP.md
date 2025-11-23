# Configuración de Resend

Guía paso a paso para configurar el sistema de emails con Resend.

## 1. Crear cuenta en Resend

1. Ve a [resend.com](https://resend.com)
2. Haz clic en "Sign Up"
3. Crea tu cuenta con email o GitHub

## 2. Obtener API Key

1. Una vez dentro, ve a **API Keys**
2. Haz clic en **Create API Key**
3. Dale un nombre (ej: "Lobito Corner - Development")
4. Copia la API key (solo se muestra una vez)

## 3. Configurar en desarrollo

Agrega la API key al archivo `.env`:

```bash
VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
```

⚠️ **Importante**: Reinicia el servidor después de agregar la variable:

```bash
npm run dev
```

## 4. Verificar configuración

El sistema mostrará un warning si la API key no está configurada:

```
⚠️ Resend API key not configured. Email notifications will not work.
```

Si ves este mensaje, verifica:
- Que la variable esté en `.env`
- Que el nombre sea exactamente `VITE_RESEND_API_KEY`
- Que hayas reiniciado el servidor

## 5. Testing en desarrollo

### Probar email de bienvenida

1. Registra un nuevo usuario en `/register`
2. Revisa la consola del navegador
3. Deberías ver: `✅ Welcome email sent: ...`
4. Revisa tu bandeja de entrada

### Probar email de confirmación

```javascript
import { sendBookingConfirmation } from '@features/notifications';

const testBooking = {
  bookingId: 'test_123',
  userId: 'user_456',
  userEmail: 'tu-email@example.com', // Tu email real
  userName: 'Test User',
  productTitle: 'Clase de Prueba',
  teacherName: 'Profesor Test',
  bookingDate: '15 de Enero, 2024',
  bookingTime: '10:00 AM',
  duration: 60,
  price: 50,
};

await sendBookingConfirmation(testBooking);
```

## 6. Configurar dominio personalizado (Producción)

### Plan Free
- Solo puedes usar `onboarding@resend.dev`
- Límite: 100 emails/día

### Plan Pro ($20/mes)
1. Ve a **Domains** en Resend
2. Haz clic en **Add Domain**
3. Ingresa tu dominio (ej: `lobitoCorner.com`)
4. Configura los registros DNS:

```
Type: TXT
Name: @
Value: [valor proporcionado por Resend]

Type: MX
Name: @
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

5. Espera la verificación (puede tomar hasta 48 horas)
6. Actualiza el código:

```javascript
// src/services/resend/config.js
export const EMAIL_CONFIG = {
  from: 'Lobito Corner <noreply@lobitoCorner.com>',
  replyTo: 'support@lobitoCorner.com',
};
```

## 7. Configurar en Vercel (Producción)

### Variables de entorno

En Vercel Dashboard > Settings > Environment Variables:

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Firebase Admin (para cron jobs)
FIREBASE_PROJECT_ID=lc-english-e52c2
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@lc-english-e52c2.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nXXXXX\n-----END PRIVATE KEY-----\n"

# Cron Secret (genera uno aleatorio)
CRON_SECRET=un-secret-muy-seguro-y-aleatorio
```

### Obtener credenciales de Firebase Admin

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️)
4. Pestaña **Service Accounts**
5. Haz clic en **Generate new private key**
6. Se descargará un archivo JSON
7. Extrae los valores:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

⚠️ **Importante**: La private key debe incluir los `\n`:
```
"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

### Generar CRON_SECRET

```bash
# En terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 8. Verificar cron job en Vercel

1. Deploy a Vercel
2. Ve a **Deployments** > tu deployment
3. Ve a **Functions**
4. Busca `/api/cron/send-reminders`
5. Revisa los logs

### Ejecutar manualmente

```bash
curl -X POST https://tu-app.vercel.app/api/cron/send-reminders \
  -H "Authorization: Bearer tu-cron-secret"
```

## 9. Monitoreo

### Dashboard de Resend

1. Ve a **Emails** en Resend
2. Verás todos los emails enviados
3. Estado: Delivered, Bounced, etc.
4. Click en un email para ver detalles

### Logs de Vercel

1. Ve a **Deployments** > Functions
2. Filtra por `/api/cron/send-reminders`
3. Revisa logs de ejecución

### Firestore

Revisa la colección `notifications`:
- `sent: true` = Email enviado
- `sent: false` = Pendiente
- `emailId` = ID de Resend

## 10. Límites y quotas

### Plan Free
- ✅ 100 emails/día
- ✅ 3,000 emails/mes
- ❌ Solo `onboarding@resend.dev`
- ❌ Sin webhooks
- ❌ Sin analytics avanzado

### Plan Pro ($20/mes)
- ✅ 50,000 emails/mes
- ✅ Dominios personalizados
- ✅ Webhooks
- ✅ Analytics completo
- ✅ Soporte prioritario

## 11. Troubleshooting

### Error: "API key not configured"
- Verifica `.env`
- Reinicia servidor
- Verifica que sea `VITE_RESEND_API_KEY`

### Error: "Daily sending quota exceeded"
- Has alcanzado el límite de 100 emails/día
- Espera 24 horas o upgradea a Pro

### Emails no llegan
1. Revisa spam
2. Verifica email en Dashboard de Resend
3. Revisa logs de errores
4. Verifica que el email destino sea válido

### Cron job no ejecuta
1. Verifica que esté deployado en Vercel
2. Revisa variables de entorno en Vercel
3. Verifica `CRON_SECRET`
4. Revisa logs en Vercel

### Error: "Invalid API key"
- La API key es incorrecta
- Genera una nueva en Resend
- Actualiza en `.env` y Vercel

## 12. Best practices

### Desarrollo
- Usa emails de prueba
- No envíes a usuarios reales
- Limita el volumen de testing

### Producción
- Usa dominio verificado
- Configura SPF, DKIM, DMARC
- Monitorea bounce rate
- Implementa unsubscribe
- Respeta límites de envío

### Seguridad
- Nunca commitees API keys
- Usa variables de entorno
- Rota keys periódicamente
- Protege endpoints de cron

## Recursos

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
