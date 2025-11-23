# Lobito Corner

Proyecto React con arquitectura modular por features.

## Stack

- **Frontend**: Vite + React + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Email**: Resend
- **Deploy**: Vercel

## Estructura

```
src/
  design/          # Sistema de diseño
  features/        # Features modulares
  components/      # Componentes compartidos
  layout/          # Layouts
  router/          # Configuración de rutas
  services/        # Servicios (Firebase, APIs)
  utils/           # Utilidades
  app/             # Configuración de la app
```

## Sistema de Diseño

El proyecto incluye un sistema de diseño completo en `src/design/`:

- **tokens.css**: Variables CSS para colores, espaciado, sombras, etc.
- **theme.js**: Configuración del tema para JavaScript
- **components/**: Componentes base (Button, Card, Input, Badge, Section, Logo)

### Cambiar identidad visual

1. Editar `src/design/tokens.css` con nuevos colores
2. Reemplazar `src/design/components/Logo.jsx` con el logo real
3. Todo el proyecto se actualiza automáticamente

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Copiar `.env.example` a `.env`
3. Reemplazar las credenciales en `.env` con las de tu proyecto

## Rutas disponibles

- `/` - Home
- `/dashboard` - Dashboard principal
- `/products` - Productos
- `/calendar` - Calendario
- `/bookings` - Reservas
- `/blog` - Blog
- `/recordings` - Grabaciones
- `/chat` - Chat
- `/notifications` - Notificaciones
- `/profile` - Perfil
- `/login` - Iniciar sesión
- `/register` - Registro

## Autenticación

El proyecto incluye un sistema completo de autenticación con Firebase:

- **Registro** con selección de rol (student/teacher)
- **Login** con validación
- **Perfil** editable
- **Protección de rutas** por autenticación y rol
- **Persistencia** de sesión

### Roles disponibles

- **student** (🎓 Estudiante): Acceso a todas las rutas excepto recordings
- **teacher** (👨‍🏫 Profesor): Acceso completo incluyendo recordings

## Features implementados

### 🔐 Auth (Bloque 2)
- Registro y login con Firebase Auth
- Roles: student y teacher
- Protección de rutas
- Perfil editable

### 📦 Products (Bloque 3)
- Listado de productos con filtros
- Detalle completo del producto
- Búsqueda por texto
- Filtros por categoría
- Botón "Agendar Clase" → calendario
- Cards responsive con información completa

### 📧 Notifications (Bloque 5)
- Sistema de emails con Resend
- Email de confirmación de reserva
- Recordatorio 24 horas antes
- Recordatorio el mismo día
- Email de bienvenida
- Cron jobs automáticos en Vercel
- Templates HTML profesionales

### 📝 Blog (Bloque 6)
- Sistema completo de blog
- Crear, editar y eliminar posts (solo teachers)
- Listado con filtros y búsqueda
- Categorías con colores
- Posts destacados y borradores
- Contador de vistas
- Tiempo de lectura automático
- Editor simple con validación

### 🎥 Recordings (Bloque 7)
- Subida de grabaciones a Firebase Storage
- Metadata en Firestore
- Vista de estudiante (mis grabaciones)
- Vista de profesor (subir y administrar)
- Progress bar durante subida
- Validación de archivos (tipo y tamaño)
- Búsqueda en tiempo real
- Eliminar grabaciones (solo profesor)

### 💬 Chat (Bloque 8)
- Chat 1:1 en tiempo real (Firestore snapshots)
- Estudiante ↔ Profesor
- Lista de conversaciones (profesor)
- Mensajes instantáneos
- Marcar como leído automático
- Contador de no leídos
- Indicador de lectura (✓✓)
- Auto-scroll y timestamps

### 📊 Teacher Dashboard (Bloque 9)
- Panel completo del profesor
- Estadísticas principales (posts, grabaciones, chats, estudiantes)
- Acciones rápidas (8 accesos directos)
- Actividad reciente unificada
- Panel de mensajes con no leídos
- Panel de posts recientes
- Sección de estudiantes con acciones
- Diseño responsive y modular

### 📅 Calendar + Bookings (Bloque 4)
- Calendario mensual interactivo
- Disponibilidad del profesor configurable
- Reservas de clases con validaciones
- Integración con Google Calendar API
- Sincronización bidireccional
- Reprogramación con restricciones (24h)
- Cancelación con validaciones
- TimeSlot picker visual
- Modal de reserva completo
- Vista de eventos detallada

### 🎓 Student Dashboard (Bloque 10)
- Panel completo del estudiante
- Próximas clases con countdown
- Reprogramar/cancelar (con validación 24h)
- Grabaciones recientes
- Chat directo con profesor
- Productos adquiridos
- Acciones rápidas
- Estadísticas personales

## 🚀 Deploy y Producción

### Documentación de Deploy

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones completas de deploy en Vercel.

### Optimización

Ver [OPTIMIZACION.md](./OPTIMIZACION.md) para guía de optimización de performance.

### Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
npm run format:check
```

## 🧪 Usuarios de Prueba

Para probar el sistema rápidamente con diferentes roles:

### Acceso Rápido: `/demo`

**Profesor Demo:**
- Email: `profesor@demo.com`
- Password: `demo123`
- Acceso completo al panel de profesor

**Estudiante Demo:**
- Email: `estudiante@demo.com`
- Password: `demo123`
- Vista de estudiante

**Instrucciones:**
1. Ve a `http://localhost:5173/demo`
2. Click en "Crear esta cuenta" (solo primera vez)
3. Luego usa "Acceder" para login rápido

Ver [USUARIOS_DEMO.md](./USUARIOS_DEMO.md) para más detalles.

## Bloques completados

✅ **Bloque 0**: Sistema de diseño base  
✅ **Bloque 1**: Setup base del proyecto  
✅ **Bloque 2**: Feature de autenticación completa  
✅ **Bloque 3**: Feature de productos completa  
✅ **Bloque 4**: Calendario y reservas + Google Calendar  
✅ **Bloque 5**: Sistema de notificaciones por email  
✅ **Bloque 6**: Sistema de blog completo  
✅ **Bloque 7**: Sistema de grabaciones con Storage  
✅ **Bloque 8**: Sistema de chat 1:1 en tiempo real  
✅ **Bloque 9**: Panel del profesor (Teacher Dashboard)  
✅ **Bloque 10**: Panel del estudiante (Student Dashboard)  
✅ **Bloque 11**: Deploy final + Optimización
