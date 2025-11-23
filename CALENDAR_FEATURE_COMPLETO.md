# 📅 Calendar + Bookings Feature - Implementación Completa

## ✅ Estado Actual

### Servicios Implementados (Bloque 4):
- ✅ `bookings/services/availabilityService.js` - Gestión de disponibilidad
- ✅ `bookings/services/bookingService.js` - CRUD de reservas
- ✅ `bookings/hooks/useBookings.js` - Hooks de reservas

### Nuevos Componentes Creados:
- ✅ `calendar/components/Calendar.jsx` - Calendario mensual interactivo
- ✅ `calendar/components/TimeSlotPicker.jsx` - Selector de horarios
- ✅ `calendar/services/googleCalendarService.js` - Integración Google Calendar

## 🎯 Componentes Pendientes por Crear

### 1. **AvailabilityConfig Component** (Profesor)
**Ubicación**: `src/features/calendar/components/AvailabilityConfig.jsx`

```jsx
/**
 * Configurador de disponibilidad semanal
 * - Horarios por día de la semana
 * - Múltiples bloques horarios
 * - Duración de slots
 * - Buffer entre clases
 * - Restricciones (anticipación, cancelación)
 */
```

**Características**:
- Toggle para cada día de la semana
- Agregar/eliminar bloques horarios
- Configuración de duración (30/60/90 min)
- Buffer time (0/15/30 min)
- Anticipación mínima/máxima
- Reglas de cancelación/reprogramación

### 2. **BookingModal Component**
**Ubicación**: `src/features/calendar/components/BookingModal.jsx`

```jsx
/**
 * Modal para crear/editar reservas
 * - Selección de producto/clase
 * - Fecha y hora
 * - Notas adicionales
 * - Confirmación
 */
```

**Características**:
- Dropdown de productos
- Resumen de la reserva
- Campo de notas
- Botones de confirmar/cancelar
- Validaciones

### 3. **GoogleCalendarSync Component**
**Ubicación**: `src/features/calendar/components/GoogleCalendarSync.jsx`

```jsx
/**
 * Componente de sincronización con Google Calendar
 * - Conectar/desconectar cuenta
 * - Estado de sincronización
 * - Opciones de sync
 */
```

**Características**:
- Botón "Conectar con Google"
- Estado de conexión
- Sincronización automática toggle
- Última sincronización
- Botón manual de sync

### 4. **EventDetailsModal Component**
**Ubicación**: `src/features/calendar/components/EventDetailsModal.jsx`

```jsx
/**
 * Modal con detalles del evento/reserva
 * - Información completa
 * - Acciones (editar, cancelar, reprogramar)
 * - Participantes
 */
```

## 📄 Páginas Pendientes por Crear

### 1. **StudentBookingPage** (Estudiante)
**Ubicación**: `src/features/calendar/pages/StudentBookingPage.jsx`

```jsx
/**
 * Página para que estudiantes reserven clases
 * Layout: Calendar (izq) + TimeSlotPicker (der)
 */
```

**Secciones**:
- Calendario con disponibilidad
- Selector de horarios
- Lista de productos
- Botón "Reservar"
- Mis próximas reservas

### 2. **TeacherCalendarPage** (Profesor)
**Ubicación**: `src/features/calendar/pages/TeacherCalendarPage.jsx`

```jsx
/**
 * Página de calendario del profesor
 * Ver todas las reservas y gestionar
 */
```

**Secciones**:
- Calendario con todas las reservas
- Filtros (confirmadas, pendientes, canceladas)
- Botón "Configurar Disponibilidad"
- Botón "Sincronizar Google Calendar"
- Estadísticas (reservas del mes, cancelaciones)

### 3. **AvailabilityConfigPage** (Profesor)
**Ubicación**: `src/features/calendar/pages/AvailabilityConfigPage.jsx`

```jsx
/**
 * Página de configuración de disponibilidad
 * Configurar horarios semanales y restricciones
 */
```

**Secciones**:
- AvailabilityConfig component
- Preview del calendario
- Botón "Guardar Cambios"
- Excepciones (vacaciones, días libres)

## 🔧 Configuración de Google Calendar API

### 1. Crear proyecto en Google Cloud Console

```bash
1. Ve a https://console.cloud.google.com
2. Crear nuevo proyecto: "Lobito Corner"
3. Habilitar Google Calendar API
4. Crear credenciales OAuth 2.0
5. Configurar pantalla de consentimiento
```

### 2. Obtener credenciales

```javascript
// Necesitas:
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=tu_api_key
```

### 3. Configurar orígenes autorizados

```
JavaScript origins:
- http://localhost:5173
- https://tu-dominio.vercel.app

Redirect URIs:
- http://localhost:5173
- https://tu-dominio.vercel.app
```

### 4. Agregar a .env

```bash
# Google Calendar API
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

## 🔄 Flujo de Integración Google Calendar

### Para el Profesor:

```javascript
1. Click en "Conectar Google Calendar"
2. Autenticación OAuth
3. Permisos de calendario
4. Sincronización automática habilitada
5. Cada reserva se crea en Google Calendar
6. Actualizaciones bidireccionales
```

### Para el Estudiante:

```javascript
1. Reserva una clase
2. Sistema crea evento en Firestore
3. Si profesor tiene Google sync:
   - Evento se crea en Google Calendar del profesor
   - Estudiante recibe invitación por email
   - Puede aceptar/rechazar desde Google
```

## 📊 Estructura de Datos Extendida

### Booking con Google Calendar:

```javascript
{
  // ... campos existentes
  googleEventId: "google_event_id_123", // ID del evento en Google
  googleSyncEnabled: true,
  googleSyncedAt: Timestamp,
  googleSyncError: null,
}
```

### Teacher Availability con Google:

```javascript
{
  // ... campos existentes
  googleCalendarConnected: true,
  googleCalendarEmail: "profesor@gmail.com",
  googleAutoSync: true,
  googleLastSync: Timestamp,
}
```

## 🎨 Componentes Visuales Sugeridos

### Calendar Component (Ya creado) ✅
- Vista mensual
- Navegación mes anterior/siguiente
- Botón "Hoy"
- Días con eventos marcados
- Click en día para ver detalles
- Legend de estados

### TimeSlotPicker Component (Ya creado) ✅
- Grid de horarios
- Slots disponibles (verde)
- Slots ocupados (gris)
- Selección de slot
- Formato 24h

### AvailabilityConfig Component (Pendiente)
```
┌─────────────────────────────────────┐
│ Configurar Disponibilidad           │
├─────────────────────────────────────┤
│ ☑ Lunes    [09:00] - [17:00]  [+]  │
│ ☑ Martes   [09:00] - [17:00]  [+]  │
│ ☑ Miércoles [09:00] - [17:00]  [+]  │
│ ☑ Jueves   [09:00] - [17:00]  [+]  │
│ ☑ Viernes  [09:00] - [17:00]  [+]  │
│ ☐ Sábado                            │
│ ☐ Domingo                           │
├─────────────────────────────────────┤
│ Duración de clase: [60 min ▼]      │
│ Tiempo entre clases: [15 min ▼]    │
│ Anticipación mínima: [1 día ▼]     │
│ Anticipación máxima: [30 días ▼]   │
│ Cancelación mínima: [24 horas ▼]   │
├─────────────────────────────────────┤
│ [Cancelar]  [Guardar Cambios]      │
└─────────────────────────────────────┘
```

### GoogleCalendarSync Component (Pendiente)
```
┌─────────────────────────────────────┐
│ 📅 Google Calendar                  │
├─────────────────────────────────────┤
│ Estado: ✅ Conectado                │
│ Cuenta: profesor@gmail.com         │
│                                     │
│ ☑ Sincronización automática        │
│ Última sync: Hace 5 minutos        │
│                                     │
│ [Sincronizar Ahora]                │
│ [Desconectar]                      │
└─────────────────────────────────────┘
```

## 🚀 Plan de Implementación

### Fase 1: Componentes Básicos (1-2 horas)
```
✅ Calendar Component
✅ TimeSlotPicker Component
⏳ AvailabilityConfig Component
⏳ BookingModal Component
```

### Fase 2: Google Calendar (1 hora)
```
✅ googleCalendarService.js
⏳ GoogleCalendarSync Component
⏳ Integración con bookings
```

### Fase 3: Páginas (2 horas)
```
⏳ StudentBookingPage
⏳ TeacherCalendarPage
⏳ AvailabilityConfigPage
```

### Fase 4: Integración y Testing (1 hora)
```
⏳ Exportar feature
⏳ Actualizar router
⏳ Testing completo
⏳ Documentación
```

## 📝 Código de Ejemplo: Uso del Calendar

### En StudentBookingPage:

```jsx
import { Calendar, TimeSlotPicker } from '@features/calendar';
import { generateAvailableSlots } from '@features/bookings';

const StudentBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    // Obtener slots disponibles
    const availability = await getTeacherAvailability(teacherId);
    const bookings = await getBookingsByDate(teacherId, date);
    const availableSlots = generateAvailableSlots(availability, date, bookings);
    setSlots(availableSlots);
  };

  const handleBooking = async () => {
    await createBooking({
      studentId,
      teacherId,
      date: selectedDate,
      time: selectedSlot,
      // ...
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Calendar
        events={myBookings}
        onDateClick={handleDateClick}
        highlightedDates={availableDates}
      />
      <TimeSlotPicker
        date={selectedDate}
        slots={slots}
        selectedSlot={selectedSlot}
        onSlotSelect={setSelectedSlot}
      />
    </div>
  );
};
```

## 🎯 Próximos Pasos

1. **Crear componentes pendientes**:
   - AvailabilityConfig
   - BookingModal
   - GoogleCalendarSync
   - EventDetailsModal

2. **Crear páginas**:
   - StudentBookingPage
   - TeacherCalendarPage
   - AvailabilityConfigPage

3. **Configurar Google Calendar API**:
   - Crear proyecto en Google Cloud
   - Obtener credenciales
   - Configurar OAuth

4. **Integración**:
   - Conectar bookings con calendar
   - Sincronización Google Calendar
   - Notificaciones

5. **Testing**:
   - Crear reserva
   - Reprogramar
   - Cancelar
   - Sincronizar con Google

## 📚 Recursos

- [Google Calendar API](https://developers.google.com/calendar/api/guides/overview)
- [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [React Calendar Libraries](https://www.npmjs.com/package/react-calendar)

---

**Estado**: Servicios y componentes base listos. Pendiente: componentes avanzados, páginas y configuración de Google Calendar.
