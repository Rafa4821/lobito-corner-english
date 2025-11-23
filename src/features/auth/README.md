# Auth Feature

Sistema completo de autenticación con Firebase Auth y Firestore.

## Estructura

```
auth/
  ├── components/
  │   ├── ProtectedRoute.jsx    # Protección de rutas privadas
  │   └── PublicRoute.jsx        # Rutas públicas (redirige si autenticado)
  ├── context/
  │   └── AuthContext.jsx        # Contexto global de autenticación
  ├── pages/
  │   ├── LoginPage.jsx          # Página de inicio de sesión
  │   ├── RegisterPage.jsx       # Página de registro
  │   └── ProfilePage.jsx        # Página de perfil editable
  ├── services/
  │   ├── authService.js         # Servicios de Firebase Auth
  │   └── userService.js         # Servicios de Firestore (users)
  └── index.js                   # Exportación centralizada
```

## Uso

### AuthProvider

Envolver la aplicación con `AuthProvider`:

```jsx
import { AuthProvider } from '@features/auth';

function App() {
  return (
    <AuthProvider>
      {/* Tu app */}
    </AuthProvider>
  );
}
```

### useAuth Hook

Acceder al estado de autenticación:

```jsx
import { useAuth } from '@features/auth';

function MyComponent() {
  const { user, userData, isAuthenticated, isStudent, isTeacher } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Hola {user.displayName}</p>}
      {isTeacher() && <p>Eres profesor</p>}
    </div>
  );
}
```

### Proteger rutas

```jsx
import { ProtectedRoute } from '@features/auth';

// Ruta que requiere autenticación
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Ruta que requiere rol específico
<ProtectedRoute requireRole="teacher">
  <RecordingsPage />
</ProtectedRoute>
```

### Rutas públicas

```jsx
import { PublicRoute } from '@features/auth';

// Redirige a /dashboard si ya está autenticado
<PublicRoute>
  <LoginPage />
</PublicRoute>
```

## Servicios

### authService.js

- `registerUser({ email, password, name, role })` - Registrar usuario
- `loginUser({ email, password })` - Iniciar sesión
- `logoutUser()` - Cerrar sesión
- `updateUserProfile(userId, updates)` - Actualizar perfil
- `changePassword(newPassword)` - Cambiar contraseña
- `resetPassword(email)` - Recuperar contraseña
- `resendVerificationEmail()` - Reenviar verificación

### userService.js

- `createUserDocument(userId, userData)` - Crear documento en Firestore
- `getUserDocument(userId)` - Obtener documento de usuario
- `updateUserDocument(userId, updates)` - Actualizar documento
- `getUsersByRole(role)` - Obtener usuarios por rol
- `hasRole(userId, role)` - Verificar rol
- `changeUserRole(userId, newRole)` - Cambiar rol

## Roles

- **student** (🎓): Estudiante
- **teacher** (👨‍🏫): Profesor

## Firestore Schema

### Collection: `users`

```javascript
{
  id: "user_uid",
  email: "user@example.com",
  name: "John Doe",
  role: "student", // "student" | "teacher"
  bio: "Mi biografía...",
  phone: "+1234567890",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Características

✅ Registro con email/password  
✅ Login con validación  
✅ Logout  
✅ Perfil editable  
✅ Roles (student/teacher)  
✅ Protección de rutas  
✅ Persistencia de sesión  
✅ Verificación de email  
✅ Recuperación de contraseña  
✅ Actualización de datos en Firestore  
✅ Context API para estado global
