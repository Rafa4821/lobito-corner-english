# 🧪 Usuarios de Prueba - Guía Rápida

Esta guía te ayudará a probar todas las funcionalidades del sistema con usuarios de demostración.

## 🚀 Acceso Rápido

### Opción 1: Página de Demo (Recomendado)

1. Ve a: **http://localhost:5173/demo**
2. Verás 2 tarjetas con usuarios de prueba
3. Click en **"Crear esta cuenta"** (solo la primera vez)
4. Luego usa **"Acceder"** para login rápido

### Opción 2: Desde Login

1. Ve a: **http://localhost:5173/login**
2. Verás un banner amarillo "Modo Desarrollo"
3. Click en **"Acceder con usuarios de prueba"**

## 👥 Usuarios Disponibles

### 👨‍🏫 Profesor Demo

```
Email:    profesor@demo.com
Password: demo123
Rol:      teacher
```

**Acceso a:**
- ✅ Panel del profesor (`/teacher/dashboard`)
- ✅ Subir grabaciones
- ✅ Gestionar blog (crear/editar posts)
- ✅ Ver todos los chats con estudiantes
- ✅ Panel de estadísticas completo
- ✅ Gestionar reservas
- ✅ Ver calendario

### 🎓 Estudiante Demo

```
Email:    estudiante@demo.com
Password: demo123
Rol:      student
```

**Acceso a:**
- ✅ Dashboard de estudiante (`/dashboard`)
- ✅ Ver mis grabaciones
- ✅ Chat con profesor
- ✅ Ver productos/clases
- ✅ Reservar clases
- ✅ Ver blog

## 📝 Instrucciones de Uso

### Primera vez (Crear cuentas):

1. **Ir a `/demo`**
2. **Profesor**: Click en "Crear esta cuenta"
   - Se abrirá el registro con datos prellenados
   - Completa la contraseña: `demo123`
   - Confirma la contraseña: `demo123`
   - Click en "Crear Cuenta"
3. **Cerrar sesión** (si quedaste logueado)
4. **Estudiante**: Repetir el proceso
5. ¡Listo! Ahora puedes usar "Acceder" directamente

### Siguientes veces (Login rápido):

1. **Ir a `/demo`**
2. Click en **"Acceder"** del usuario que quieras probar
3. Serás redirigido automáticamente:
   - Profesor → `/teacher/dashboard`
   - Estudiante → `/dashboard`

## 🔄 Cambiar entre usuarios

Para probar diferentes roles:

1. **Cerrar sesión** del usuario actual
2. **Ir a `/demo`**
3. **Acceder** con el otro usuario

## 🎯 Qué probar con cada usuario

### Como Profesor:

1. **Dashboard** (`/teacher/dashboard`)
   - Ver estadísticas
   - Acciones rápidas
   - Actividad reciente
   - Sección de estudiantes

2. **Grabaciones** (`/recordings`)
   - Subir nueva grabación
   - Asignar a estudiante
   - Ver listado completo

3. **Blog** (`/blog`)
   - Crear nuevo post
   - Editar posts existentes
   - Publicar/despublicar

4. **Chat** (`/chat`)
   - Ver lista de conversaciones
   - Chatear con estudiantes
   - Ver mensajes no leídos

### Como Estudiante:

1. **Dashboard** (`/dashboard`)
   - Ver resumen
   - Próximas clases

2. **Mis Grabaciones** (`/my-classes/recordings`)
   - Ver grabaciones asignadas
   - Descargar/ver grabaciones

3. **Mi Chat** (`/my-chat`)
   - Chatear con el profesor
   - Ver mensajes

4. **Productos** (`/products`)
   - Ver clases disponibles
   - Detalles de productos

## 🔐 Registro Manual

Si prefieres crear usuarios manualmente:

1. **Ir a `/register`**
2. Llenar el formulario
3. **Importante**: Seleccionar el rol correcto:
   - 🎓 **Estudiante** (por defecto)
   - 👨‍🏫 **Profesor**
4. Crear cuenta

## ⚠️ Importante

### En Desarrollo:
- ✅ La página `/demo` está disponible
- ✅ El banner aparece en `/login`
- ✅ Puedes crear usuarios de prueba fácilmente

### En Producción:
- ❌ Eliminar la ruta `/demo` del router
- ❌ Remover el banner de desarrollo del login
- ❌ O usar variables de entorno para ocultarlos

## 🛠️ Troubleshooting

### "Este usuario aún no existe"
**Solución**: Click en "Crear esta cuenta" primero

### "Email ya está registrado"
**Solución**: El usuario ya existe, usa "Acceder" directamente

### No veo el panel de profesor
**Solución**: Asegúrate de haber creado la cuenta con rol "teacher"

### No puedo acceder a ciertas páginas
**Solución**: Verifica que estés usando el usuario correcto (profesor vs estudiante)

## 🔧 Para Desarrolladores

### Agregar más usuarios demo:

Edita `src/router/pages/DemoUsersPage.jsx`:

```javascript
const demoUsers = [
  // ... usuarios existentes
  {
    id: 'nuevo-usuario',
    name: 'Nuevo Usuario',
    email: 'nuevo@demo.com',
    password: 'demo123',
    role: 'student', // o 'teacher'
    icon: '👤',
    color: 'primary',
    description: 'Descripción',
    features: ['Feature 1', 'Feature 2'],
  },
];
```

### Eliminar en producción:

1. **Router**: Remover ruta `/demo`
2. **LoginPage**: Remover el bloque condicional de desarrollo
3. **DemoUsersPage**: Eliminar el archivo

## 📚 Recursos

- [Documentación de Auth](./src/features/auth/README.md)
- [Teacher Dashboard](./TEACHER_DASHBOARD.md)
- [Firebase Auth](https://firebase.google.com/docs/auth)
