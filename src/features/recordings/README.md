# Recordings Feature

Sistema completo de grabaciones con Firebase Storage y gestión para profesores y alumnos.

## Estructura

```
recordings/
  ├── components/
  │   ├── RecordingCard.jsx        # Card de grabación
  │   └── UploadForm.jsx           # Formulario de subida
  ├── hooks/
  │   └── useRecordings.js         # Hooks personalizados
  ├── pages/
  │   ├── StudentRecordingsPage.jsx    # Vista de estudiante
  │   └── TeacherRecordingsPage.jsx    # Vista de profesor
  ├── services/
  │   ├── recordingService.js      # Metadata en Firestore
  │   └── storageService.js        # Archivos en Storage
  └── index.js                     # Exportación centralizada
```

## Características

✅ **Subida de archivos** a Firebase Storage  
✅ **Metadata en Firestore** para búsqueda y filtrado  
✅ **Progress bar** durante la subida  
✅ **Validación de archivos** (tipo y tamaño)  
✅ **Vista de estudiante** (solo sus grabaciones)  
✅ **Vista de profesor** (subir y administrar)  
✅ **Búsqueda** en tiempo real  
✅ **Eliminar grabaciones** (solo profesor)  
✅ **Contador de vistas**  
✅ **Información detallada** (estudiante, profesor, clase)  

## Rutas

- `/my-classes/recordings` - Vista de estudiante (todos)
- `/recordings` - Vista de profesor (solo teachers)

## Firebase Storage Structure

```
storage/
  recordings/
    {studentId}/
      {timestamp}_{filename}.mp4
      {timestamp}_{filename}.mp3
      ...
```

## Firestore Schema

### Collection: `recordings`

```javascript
{
  id: "auto_generated",
  title: "Clase de pronunciación - Sesión 1",
  description: "Notas sobre la grabación...",
  fileName: "clase_pronunciacion.mp4",
  url: "https://firebasestorage.googleapis.com/...",
  filePath: "recordings/student_id/timestamp_file.mp4",
  fileSize: 52428800, // bytes
  fileType: "video/mp4",
  studentId: "firebase_uid",
  studentName: "John Doe",
  teacherId: "firebase_uid",
  teacherName: "Jane Smith",
  productId: "product_id", // opcional
  productTitle: "Clase de Inglés", // opcional
  views: 0,
  duration: "15:30", // opcional
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## Uso

### Hooks

```jsx
import { 
  useStudentRecordings, 
  useTeacherRecordings,
  useRecording 
} from '@features/recordings';

// Grabaciones de un estudiante
const { recordings, loading, error, refetch } = useStudentRecordings(studentId);

// Grabaciones subidas por un profesor
const { recordings, loading, error, refetch } = useTeacherRecordings(teacherId);

// Una grabación específica
const { recording, loading, error } = useRecording(recordingId);
```

### Servicios

```jsx
import {
  uploadRecording,
  deleteRecording,
  validateRecordingFile,
  formatFileSize,
} from '@features/recordings';

// Subir archivo
const result = await uploadRecording(
  file,
  {
    studentId: 'user_123',
    studentName: 'John Doe',
    teacherId: 'teacher_456',
    teacherName: 'Jane Smith',
  },
  (progress) => console.log(`${progress}%`)
);

// Validar archivo
const validation = validateRecordingFile(file);
if (!validation.valid) {
  alert(validation.error);
}

// Formatear tamaño
const size = formatFileSize(52428800); // "50 MB"
```

## Validaciones

### Tipos de archivo permitidos:
- **Video**: MP4, WebM, QuickTime (MOV)
- **Audio**: MP3, WAV

### Tamaño máximo:
- **500 MB** por archivo

### Validación automática:
```javascript
const validation = validateRecordingFile(file);
// { valid: true/false, error: string }
```

## Componentes

### RecordingCard

Card para mostrar grabación:
- Icono según tipo (video/audio)
- Título y fecha
- Descripción
- Información de estudiante y profesor
- Clase asociada (opcional)
- Tamaño del archivo
- Vistas
- Botón ver/descargar
- Botón eliminar (solo profesor)

Props:
```jsx
<RecordingCard 
  recording={recording}
  onDelete={handleDelete}
  canDelete={true}
/>
```

### UploadForm

Formulario completo de subida:
- Selector de estudiante
- Selector de clase (opcional)
- Campo título
- Campo descripción
- Input de archivo
- Progress bar
- Validación automática

Props:
```jsx
<UploadForm
  onUpload={handleUpload}
  loading={uploading}
  students={studentsList}
  products={productsList}
/>
```

## Flujo de subida

### Profesor sube grabación:

1. Selecciona estudiante
2. Selecciona clase (opcional)
3. Agrega título y descripción
4. Selecciona archivo
5. Validación automática (tipo y tamaño)
6. Click en "Subir"
7. Progress bar muestra avance
8. Archivo se sube a Storage
9. Metadata se guarda en Firestore
10. Grabación aparece en listado

### Estudiante ve grabación:

1. Va a `/my-classes/recordings`
2. Ve solo sus grabaciones
3. Puede buscar por texto
4. Click en "Ver/Descargar"
5. Se abre en nueva pestaña
6. Se incrementa contador de vistas

## Permisos

### Estudiantes:
- ✅ Ver sus propias grabaciones
- ✅ Descargar sus grabaciones
- ❌ No pueden eliminar
- ❌ No pueden subir

### Profesores:
- ✅ Subir grabaciones para cualquier estudiante
- ✅ Ver todas sus grabaciones subidas
- ✅ Eliminar sus grabaciones
- ✅ Asociar grabación a una clase
- ❌ No pueden ver grabaciones de otros profesores

## Búsqueda

Busca en:
- Título
- Nombre del archivo
- Descripción
- Nombre del estudiante (profesor)
- Nombre del profesor (estudiante)

En tiempo real, case insensitive.

## Seguridad

### Storage Rules (recomendadas):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /recordings/{studentId}/{fileName} {
      // Cualquiera autenticado puede leer
      allow read: if request.auth != null;
      
      // Solo teachers pueden escribir
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
      
      // Solo teachers pueden eliminar
      allow delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
    }
  }
}
```

### Firestore Rules:

```javascript
match /recordings/{recordingId} {
  // Estudiante puede leer sus propias grabaciones
  // Profesor puede leer sus grabaciones subidas
  allow read: if request.auth != null && (
    resource.data.studentId == request.auth.uid ||
    resource.data.teacherId == request.auth.uid
  );
  
  // Solo teachers pueden crear
  allow create: if request.auth != null && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'teacher';
  
  // Solo el profesor que subió puede actualizar/eliminar
  allow update, delete: if request.auth != null && 
    resource.data.teacherId == request.auth.uid;
}
```

## Optimizaciones

### Compresión de video:
- Considera comprimir videos antes de subir
- Usa herramientas como FFmpeg
- Reduce resolución si es necesario

### Streaming:
- Los archivos se abren en nueva pestaña
- El navegador hace streaming automático
- No es necesario descargar completo

### Caché:
- Firebase Storage tiene caché automático
- URLs de descarga son válidas por tiempo limitado
- Considera regenerar URLs periódicamente

## Mejoras futuras

- [ ] Reproductor integrado en la página
- [ ] Thumbnails/previews de video
- [ ] Transcripción automática (Speech-to-Text)
- [ ] Subtítulos
- [ ] Marcadores de tiempo (timestamps)
- [ ] Comentarios en grabaciones
- [ ] Compartir grabaciones
- [ ] Carpetas/organización
- [ ] Filtros avanzados (fecha, tipo, clase)
- [ ] Ordenamiento (más reciente, más visto, etc.)
- [ ] Compresión automática
- [ ] Conversión de formatos
- [ ] Límites de almacenamiento por usuario
- [ ] Estadísticas de uso

## Troubleshooting

### Error al subir archivo
- Verifica que sea un tipo permitido
- Verifica que no exceda 500 MB
- Revisa permisos de Storage
- Verifica conexión a internet

### Grabación no aparece
- Verifica que se haya completado la subida
- Revisa metadata en Firestore
- Verifica filtros de búsqueda
- Refresca la página

### No puedo eliminar
- Solo el profesor que subió puede eliminar
- Verifica que seas el autor
- Revisa permisos de Firestore

### Video no se reproduce
- Verifica que el formato sea compatible
- Prueba en otro navegador
- Descarga y reproduce localmente
- Verifica que la URL sea válida

## Recursos

- [Firebase Storage](https://firebase.google.com/docs/storage)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Video Formats](https://developer.mozilla.org/en-US/docs/Web/Media/Formats)
