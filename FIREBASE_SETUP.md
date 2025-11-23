# Configuración de Firebase

## ✅ Credenciales configuradas

El proyecto está conectado a Firebase con las siguientes credenciales:

- **Project ID**: `lc-english-e52c2`
- **Auth Domain**: `lc-english-e52c2.firebaseapp.com`
- **Storage Bucket**: `lc-english-e52c2.firebasestorage.app`

## Servicios habilitados

### 1. Firebase Authentication
- ✅ Email/Password habilitado
- Usado para registro y login de usuarios
- Roles: `student` y `teacher`

### 2. Cloud Firestore
Colecciones necesarias:

#### `users`
```javascript
{
  id: "firebase_uid",
  email: "user@example.com",
  name: "John Doe",
  role: "student" | "teacher",
  bio: "...",
  phone: "+123...",
  createdAt: "ISO_DATE",
  updatedAt: "ISO_DATE"
}
```

#### `products`
```javascript
{
  id: "auto_generated",
  title: "Nombre del curso",
  description: "...",
  category: "Programación",
  price: 50,
  duration: 60,
  level: "Principiante",
  featured: true,
  teacherId: "firebase_uid",
  teacherName: "...",
  teacherBio: "...",
  studentsCount: 100,
  features: ["..."],
  requirements: ["..."],
  image: "url",
  createdAt: "ISO_DATE",
  updatedAt: "ISO_DATE"
}
```

### 3. Cloud Storage
- Usado para almacenar imágenes de productos
- Bucket: `lc-english-e52c2.firebasestorage.app`

## Reglas de seguridad recomendadas

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Cualquiera puede leer perfiles de usuario
      allow read: if true;
      
      // Solo el usuario puede escribir su propio perfil
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      // Cualquiera autenticado puede leer productos
      allow read: if request.auth != null;
      
      // Solo teachers pueden crear/editar productos
      allow create, update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
      
      // Solo el creador puede eliminar
      allow delete: if request.auth != null && 
        resource.data.teacherId == request.auth.uid;
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      // Cualquiera puede leer
      allow read: if true;
      
      // Solo usuarios autenticados pueden subir
      allow write: if request.auth != null;
    }
    
    match /users/{userId}/{allPaths=**} {
      // Cualquiera puede leer
      allow read: if true;
      
      // Solo el usuario puede subir a su carpeta
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Pasos siguientes

### 1. Habilitar Authentication
1. Ve a Firebase Console
2. Authentication > Sign-in method
3. Habilita "Email/Password"

### 2. Crear Firestore Database
1. Ve a Firestore Database
2. Crea la base de datos en modo "production"
3. Aplica las reglas de seguridad de arriba

### 3. Habilitar Storage
1. Ve a Storage
2. Crea el bucket
3. Aplica las reglas de seguridad de arriba

### 4. Agregar productos de ejemplo
Ver `SEED_PRODUCTS.md` para instrucciones

## Verificar conexión

1. Inicia el servidor: `npm run dev`
2. Ve a `/register` y crea una cuenta
3. Verifica en Firebase Console > Authentication que el usuario se creó
4. Verifica en Firestore > users que el documento se creó

## Variables de entorno

Las credenciales están en `.env`:
```bash
VITE_FIREBASE_API_KEY=AIzaSyADsd8yb-NftHWEeq-P68T6tE1KTV8NWI8
VITE_FIREBASE_AUTH_DOMAIN=lc-english-e52c2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=lc-english-e52c2
VITE_FIREBASE_STORAGE_BUCKET=lc-english-e52c2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=25879960942
VITE_FIREBASE_APP_ID=1:25879960942:web:c1287eb6f7d5808065757f
```

⚠️ **Importante**: El archivo `.env` está en `.gitignore` y no se subirá a Git por seguridad.

## Solución de problemas

### Error: "Firebase: Error (auth/configuration-not-found)"
- Verifica que Authentication esté habilitado en Firebase Console
- Verifica que Email/Password esté habilitado

### Error: "Missing or insufficient permissions"
- Verifica las reglas de Firestore
- Asegúrate de estar autenticado

### Error: "Firebase: Error (auth/network-request-failed)"
- Verifica tu conexión a internet
- Verifica que las credenciales en `.env` sean correctas

## Recursos

- [Firebase Console](https://console.firebase.google.com/project/lc-english-e52c2)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
