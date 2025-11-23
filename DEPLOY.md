# 🚀 Guía de Deploy - Lobito Corner

Esta guía te ayudará a desplegar el proyecto en Vercel.

## 📋 Pre-requisitos

- ✅ Cuenta de [Vercel](https://vercel.com)
- ✅ Cuenta de [Firebase](https://firebase.google.com)
- ✅ Cuenta de [Resend](https://resend.com) (para emails)
- ✅ Repositorio en GitHub/GitLab/Bitbucket

## 🔧 Configuración de Firebase

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Click en "Agregar proyecto"
3. Nombre: `lobito-corner` (o el que prefieras)
4. Habilita Google Analytics (opcional)
5. Crea el proyecto

### 2. Configurar Authentication

1. En Firebase Console, ve a **Authentication**
2. Click en "Comenzar"
3. Habilita **Email/Password**
4. (Opcional) Habilita otros proveedores (Google, Facebook, etc.)

### 3. Configurar Firestore Database

1. Ve a **Firestore Database**
2. Click en "Crear base de datos"
3. Modo: **Producción** (para empezar)
4. Ubicación: Elige la más cercana (ej: `southamerica-east1`)
5. Click en "Habilitar"

### 4. Configurar Storage

1. Ve a **Storage**
2. Click en "Comenzar"
3. Modo: **Producción**
4. Ubicación: La misma que Firestore
5. Click en "Listo"

### 5. Obtener credenciales

1. Ve a **Configuración del proyecto** (⚙️ > Project Settings)
2. En la sección "Tus apps", click en el ícono web `</>`
3. Registra la app: `lobito-corner-web`
4. **Copia las credenciales** (las necesitarás para Vercel)

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 6. Configurar reglas de seguridad

#### Firestore Rules:

Ve a **Firestore Database** > **Reglas** y pega:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Blog posts
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
    
    // Recordings
    match /recordings/{recordingId} {
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.teacherId == request.auth.uid
      );
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
      allow update, delete: if request.auth != null && 
        resource.data.teacherId == request.auth.uid;
    }
    
    // Chats
    match /chats/{chatId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      allow create, update: if request.auth != null && 
        request.auth.uid in request.resource.data.participants;
      
      match /messages/{messageId} {
        allow read: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        allow create: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants &&
          request.resource.data.senderId == request.auth.uid;
        allow update: if request.auth != null;
      }
    }
    
    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.teacherId == request.auth.uid
      );
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        resource.data.studentId == request.auth.uid ||
        resource.data.teacherId == request.auth.uid
      );
    }
    
    // Teacher Availability
    match /teacherAvailability/{teacherId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.auth.uid == teacherId &&
        get(/databases/$(database)/documents/users/$(teacherId)).data.role == 'teacher';
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules:

Ve a **Storage** > **Reglas** y pega:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Recordings
    match /recordings/{studentId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/firestore/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'teacher';
      allow delete: if request.auth != null && 
        get(/firestore/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
  }
}
```

## 📧 Configuración de Resend

### 1. Crear cuenta

1. Ve a [Resend](https://resend.com)
2. Crea una cuenta
3. Verifica tu email

### 2. Obtener API Key

1. Ve a [API Keys](https://resend.com/api-keys)
2. Click en "Create API Key"
3. Nombre: `lobito-corner-production`
4. Permisos: **Full Access** (o solo "Sending access")
5. **Copia la API Key** (solo se muestra una vez)

### 3. Verificar dominio (Opcional pero recomendado)

1. Ve a [Domains](https://resend.com/domains)
2. Click en "Add Domain"
3. Ingresa tu dominio (ej: `tudominio.com`)
4. Agrega los registros DNS que te indican
5. Espera la verificación

## 🚀 Deploy en Vercel

### 1. Preparar el repositorio

```bash
# Asegúrate de que todo esté commiteado
git add .
git commit -m "Ready for production deploy"
git push origin main
```

### 2. Importar proyecto en Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en "Add New..." > "Project"
3. Importa tu repositorio de GitHub/GitLab/Bitbucket
4. Selecciona el repositorio `lobito-corner`

### 3. Configurar el proyecto

**Framework Preset**: Vite  
**Root Directory**: `./`  
**Build Command**: `npm run build`  
**Output Directory**: `dist`  
**Install Command**: `npm install`

### 4. Configurar variables de entorno

En la sección "Environment Variables", agrega:

#### Firebase:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

#### Resend:
```
VITE_RESEND_API_KEY=re_...
```

#### Cron Secret (para recordatorios):
```
CRON_SECRET=tu_secreto_aleatorio_aqui
```

**Importante**: Marca todas como disponibles en **Production**, **Preview** y **Development**

### 5. Deploy

1. Click en "Deploy"
2. Espera a que termine el build (2-5 minutos)
3. ¡Listo! Tu app está en producción 🎉

## 🔒 Configuración de Dominio Personalizado

### 1. Agregar dominio en Vercel

1. En tu proyecto, ve a **Settings** > **Domains**
2. Click en "Add"
3. Ingresa tu dominio: `tudominio.com`
4. Click en "Add"

### 2. Configurar DNS

Vercel te dará instrucciones específicas. Generalmente:

**Para dominio raíz** (`tudominio.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www** (`www.tudominio.com`):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Esperar propagación

- DNS puede tardar 24-48 horas
- Vercel emitirá automáticamente certificado SSL
- Tu sitio estará en `https://tudominio.com`

## ⚙️ Configuración del Cron Job

Para que los recordatorios por email funcionen:

### 1. Verificar vercel.json

Asegúrate de que existe `vercel.json` con:

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

### 2. Proteger el endpoint

El endpoint ya está protegido con `CRON_SECRET`. Vercel lo llamará automáticamente cada hora.

## 🧪 Testing en Producción

### 1. Crear usuarios de prueba

1. Ve a tu app en producción
2. Registra un usuario profesor: `profesor@test.com`
3. Registra un usuario estudiante: `estudiante@test.com`

### 2. Probar funcionalidades

- ✅ Login/Registro
- ✅ Crear producto (profesor)
- ✅ Subir grabación (profesor)
- ✅ Chat 1:1
- ✅ Crear post de blog (profesor)
- ✅ Ver grabaciones (estudiante)
- ✅ Reservar clase

### 3. Verificar emails

- Revisa que lleguen los emails de bienvenida
- Verifica recordatorios (si tienes reservas)

## 📊 Monitoreo

### Vercel Analytics

1. Ve a tu proyecto en Vercel
2. Click en **Analytics**
3. Activa **Web Analytics** (gratis)
4. Monitorea:
   - Visitas
   - Performance
   - Errores

### Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Monitorea:
   - **Authentication**: Usuarios registrados
   - **Firestore**: Uso de base de datos
   - **Storage**: Uso de almacenamiento
   - **Functions**: Ejecuciones (si usas)

### Resend Dashboard

1. Ve a [Resend Dashboard](https://resend.com/emails)
2. Monitorea:
   - Emails enviados
   - Tasa de entrega
   - Errores

## 🐛 Troubleshooting

### Build falla en Vercel

**Error**: `Module not found`
```bash
# Solución: Verificar imports
# Asegúrate de que todos los imports usen rutas correctas
```

**Error**: `Environment variable not defined`
```bash
# Solución: Verificar variables de entorno
# Revisa que todas las variables estén configuradas en Vercel
```

### Firebase no conecta

**Error**: `Firebase: Error (auth/configuration-not-found)`
```bash
# Solución: Verificar credenciales
# Revisa que las variables de entorno de Firebase sean correctas
```

### Emails no se envían

**Error**: `Resend API error`
```bash
# Solución: Verificar API key
# Revisa que VITE_RESEND_API_KEY sea correcta
# Verifica que el dominio esté verificado (si usas dominio personalizado)
```

### CORS errors

**Error**: `Access-Control-Allow-Origin`
```bash
# Solución: Configurar Firebase
# Ve a Firebase Console > Authentication > Settings > Authorized domains
# Agrega tu dominio de Vercel
```

## 🔄 Actualizaciones

### Deploy automático

Vercel hace deploy automático cuando haces push a `main`:

```bash
git add .
git commit -m "Update feature X"
git push origin main
```

### Preview deployments

Cada PR crea un preview deployment automático:
- URL única para testing
- No afecta producción
- Perfecto para QA

## 📝 Checklist de Deploy

Antes de hacer deploy a producción:

- [ ] Todas las variables de entorno configuradas
- [ ] Firebase reglas de seguridad actualizadas
- [ ] Resend API key configurada
- [ ] Build local exitoso (`npm run build`)
- [ ] Tests pasando (si tienes)
- [ ] Usuarios demo eliminados o deshabilitados
- [ ] Ruta `/demo` eliminada (opcional)
- [ ] Console.logs removidos
- [ ] Errores de ESLint resueltos
- [ ] README actualizado
- [ ] Dominio personalizado configurado (opcional)

## 🎉 ¡Listo!

Tu aplicación está en producción. Comparte el link:

```
https://tu-proyecto.vercel.app
```

O si configuraste dominio:

```
https://tudominio.com
```

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Vite Docs](https://vitejs.dev)
