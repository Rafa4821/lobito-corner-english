# Teacher Dashboard - Panel del Profesor

Panel de control completo para profesores con todas las funcionalidades integradas.

## Ruta

`/teacher/dashboard`

**Acceso**: Solo profesores (role: "teacher")

## Características

✅ **Vista general** con estadísticas principales  
✅ **Acciones rápidas** para tareas comunes  
✅ **Actividad reciente** de todas las secciones  
✅ **Mensajes no leídos** con contador  
✅ **Posts recientes** del blog  
✅ **Sección de estudiantes** con acciones directas  
✅ **Navegación integrada** a todas las secciones  
✅ **Diseño responsive** y modular  

## Secciones del Dashboard

### 1. Estadísticas (Stats Cards)

Muestra métricas clave:
- **Posts Publicados**: Total de posts + borradores
- **Grabaciones**: Total de grabaciones subidas
- **Conversaciones**: Chats activos + mensajes sin leer
- **Estudiantes**: Número de estudiantes activos

### 2. Acciones Rápidas (Quick Actions)

Botones de acceso directo:
- 📝 **Nuevo Post** → `/blog/new`
- 📤 **Subir Grabación** → `/recordings`
- 💬 **Mensajes** → `/chat`
- 📅 **Calendario** → `/calendar`
- 👥 **Alumnos** → Scroll a sección de estudiantes
- 📊 **Reservas** → `/bookings`
- 👤 **Mi Perfil** → `/profile`
- ⚙️ **Configuración** → `/profile`

### 3. Actividad Reciente

Feed unificado de:
- Grabaciones subidas
- Mensajes recibidos
- Posts publicados
- Nuevos estudiantes

Ordenado por fecha, muestra las 5 actividades más recientes.

### 4. Panel de Mensajes

Vista rápida de conversaciones:
- Últimos 3 chats
- Avatar del estudiante
- Último mensaje
- Badge con mensajes no leídos
- Botón "Ver Todos" → `/chat`

### 5. Panel de Posts

Vista rápida de posts:
- Últimos 3 posts
- Estado (Publicado/Borrador)
- Contador de vistas
- Botón "Ver Todos" → `/blog`

### 6. Sección de Estudiantes

Grid de todos los estudiantes:
- Avatar con inicial
- Nombre del estudiante
- Botones de acción:
  - 💬 **Chat** → Abrir conversación
  - 🎥 **Grabaciones** → Ver grabaciones del estudiante

## Componentes Utilizados

### StatsCard

Tarjeta de estadística con:
- Icono con gradiente
- Título
- Valor principal
- Subtítulo (opcional)
- Tendencia (opcional)
- Colores personalizables

Props:
```jsx
<StatsCard
  icon="📝"
  title="Posts Publicados"
  value={25}
  subtitle="5 borradores"
  trend={{ positive: true, value: "+12%" }}
  color="primary"
/>
```

### QuickActions

Grid de acciones rápidas:
- Icono grande
- Label descriptivo
- Click para navegar o ejecutar acción

Props:
```jsx
<QuickActions
  actions={[
    { icon: '📝', label: 'Nuevo Post', path: '/blog/new' },
    { icon: '💬', label: 'Mensajes', onClick: handleClick },
  ]}
/>
```

### RecentActivity

Lista de actividades recientes:
- Icono según tipo
- Título y descripción
- Badge de tipo
- Timestamp
- Loading state

Props:
```jsx
<RecentActivity
  activities={[
    {
      type: 'recording',
      title: 'Nueva grabación',
      description: 'Clase de inglés para John',
      timestamp: '2024-01-15T10:00:00Z',
    },
  ]}
  loading={false}
/>
```

## Integración con Features

El dashboard integra datos de:

### Chat
- `useUserChats(userId)` - Obtener conversaciones
- Contador de mensajes no leídos
- Último mensaje de cada chat

### Recordings
- `useTeacherRecordings(teacherId)` - Obtener grabaciones
- Total de grabaciones subidas
- Grabaciones recientes

### Blog
- `usePostsByAuthor(authorId)` - Obtener posts
- Posts publicados vs borradores
- Posts recientes con vistas

## Flujo de Uso

### Profesor accede al dashboard:

1. Navega a `/teacher/dashboard`
2. Ve estadísticas generales
3. Revisa actividad reciente
4. Verifica mensajes no leídos
5. Usa acciones rápidas para tareas comunes
6. Accede a secciones específicas según necesidad

### Navegación desde el dashboard:

- **Sidebar**: Link "Panel Profesor" (solo visible para teachers)
- **Quick Actions**: Acceso directo a todas las secciones
- **Cards**: Click en elementos para ir al detalle
- **Botones**: "Ver Todos" para ver sección completa

## Responsive Design

### Desktop (lg+):
- Grid de 4 columnas para stats
- Grid de 4 columnas para quick actions
- Layout 2/3 + 1/3 para contenido principal
- Grid de 3 columnas para estudiantes

### Tablet (md):
- Grid de 2 columnas para stats
- Grid de 4 columnas para quick actions
- Grid de 2 columnas para estudiantes

### Mobile (sm):
- Grid de 1 columna para todo
- Quick actions en 2 columnas
- Stack vertical de secciones

## Personalización

### Agregar nueva estadística:

```jsx
<StatsCard
  icon="🎯"
  title="Nueva Métrica"
  value={count}
  subtitle="Descripción"
  color="accent"
/>
```

### Agregar nueva acción rápida:

```jsx
const quickActions = [
  ...existingActions,
  {
    icon: '🆕',
    label: 'Nueva Acción',
    path: '/nueva-ruta',
  },
];
```

### Agregar nueva sección:

```jsx
<Card variant="elevated" padding="lg">
  <h3 className="text-lg font-bold mb-4">Nueva Sección</h3>
  {/* Contenido */}
</Card>
```

## Mejoras Futuras

- [ ] Gráficos de estadísticas (Chart.js)
- [ ] Filtros de fecha para actividad
- [ ] Exportar reportes
- [ ] Calendario integrado
- [ ] Notificaciones en tiempo real
- [ ] Widgets personalizables
- [ ] Drag & drop para reorganizar
- [ ] Modo oscuro
- [ ] Atajos de teclado
- [ ] Tour guiado para nuevos profesores

## Troubleshooting

### Dashboard no carga datos
- Verifica que el usuario sea profesor
- Revisa hooks de cada feature
- Verifica permisos de Firestore

### Estadísticas incorrectas
- Verifica que los datos se estén cargando
- Revisa filtros aplicados
- Verifica cálculos de contadores

### Acciones rápidas no funcionan
- Verifica rutas en el router
- Revisa permisos de navegación
- Verifica que las páginas existan

## Recursos

- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Design System](./src/design/README.md)
