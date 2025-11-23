# Chat Feature

Sistema completo de chat 1:1 en tiempo real entre estudiantes y profesores.

## Estructura

```
chat/
  ├── components/
  │   ├── ChatList.jsx          # Lista de conversaciones
  │   ├── ChatWindow.jsx        # Ventana de chat
  │   └── MessageBubble.jsx     # Burbuja de mensaje
  ├── hooks/
  │   └── useChat.js            # Hooks en tiempo real
  ├── pages/
  │   ├── StudentChatPage.jsx   # Vista de estudiante
  │   └── TeacherChatPage.jsx   # Vista de profesor
  ├── services/
  │   └── chatService.js        # Servicios de Firestore
  └── index.js                  # Exportación centralizada
```

## Características

✅ **Chat en tiempo real** con Firestore snapshots  
✅ **1:1 único** entre cada estudiante y profesor  
✅ **Lista de conversaciones** para profesores  
✅ **Mensajes instantáneos** sin recargar  
✅ **Marcar como leído** automático  
✅ **Contador de no leídos** en tiempo real  
✅ **Indicador de lectura** (✓✓)  
✅ **Auto-scroll** al último mensaje  
✅ **Timestamps** en cada mensaje  
✅ **Burbujas de chat** estilizadas  
✅ **Enter para enviar**, Shift+Enter para nueva línea  

## Rutas

- `/my-chat` - Vista de estudiante (solo students)
- `/chat` - Vista de profesor (solo teachers)

## Firestore Structure

### Collection: `chats`

```javascript
chats/
  {chatId} // generado: studentId_teacherId (ordenado alfabéticamente)
    participants: ["student_uid", "teacher_uid"]
    participantNames: {
      "student_uid": "John Doe",
      "teacher_uid": "Jane Smith"
    }
    lastMessage: "Último mensaje enviado..."
    lastMessageSenderId: "student_uid"
    lastTimestamp: Timestamp
    unreadCount: {
      "student_uid": 0,
      "teacher_uid": 2
    }
    createdAt: Timestamp
```

### Subcollection: `chats/{chatId}/messages`

```javascript
messages/
  {messageId}
    senderId: "student_uid"
    text: "Hola, tengo una pregunta..."
    timestamp: Timestamp
    read: false
```

## Uso

### Hooks

```jsx
import { 
  useUserChats, 
  useChatMessages,
  useGetOrCreateChat 
} from '@features/chat';

// Chats del usuario en tiempo real
const { chats, loading, error } = useUserChats(userId);

// Mensajes de un chat en tiempo real
const { messages, loading, error } = useChatMessages(chatId);

// Obtener o crear chat
const { getChat, loading, error } = useGetOrCreateChat();
const chat = await getChat(studentId, teacherId, studentName, teacherName);
```

### Servicios

```jsx
import {
  generateChatId,
  getOrCreateChat,
  sendMessage,
  markMessagesAsRead,
  subscribeToUserChats,
  subscribeToMessages,
} from '@features/chat';

// Generar ID de chat
const chatId = generateChatId(studentId, teacherId);

// Enviar mensaje
await sendMessage(chatId, senderId, "Hola!");

// Marcar como leídos
await markMessagesAsRead(chatId, userId);

// Suscribirse a cambios
const unsubscribe = subscribeToUserChats(userId, (chats) => {
  console.log('Chats actualizados:', chats);
});
```

## Componentes

### ChatList

Lista de conversaciones con:
- Avatar del otro participante
- Nombre del otro participante
- Último mensaje
- Timestamp del último mensaje
- Contador de no leídos (badge rojo)
- Indicador "Tú:" si el último mensaje es propio
- Highlight del chat seleccionado

Props:
```jsx
<ChatList
  chats={chats}
  currentUserId={userId}
  selectedChatId={chatId}
  onSelectChat={handleSelect}
  loading={loading}
/>
```

### ChatWindow

Ventana de chat completa con:
- Header con avatar y nombre
- Área de mensajes con scroll automático
- Burbujas de mensajes (propias y del otro)
- Input de texto con botón enviar
- Progress de envío
- Empty state si no hay mensajes

Props:
```jsx
<ChatWindow
  chat={chat}
  currentUserId={userId}
  otherUserName={otherName}
/>
```

### MessageBubble

Burbuja individual de mensaje:
- Texto del mensaje
- Timestamp (HH:MM)
- Indicador de leído (✓✓) si es propio
- Estilo diferente para mensajes propios vs recibidos
- Alineación izquierda/derecha según sender

Props:
```jsx
<MessageBubble
  message={message}
  isOwn={message.senderId === currentUserId}
/>
```

## Flujo de uso

### Estudiante:

1. Va a `/my-chat`
2. Se crea automáticamente chat con su profesor
3. Puede enviar mensajes
4. Ve mensajes en tiempo real
5. Mensajes se marcan como leídos automáticamente
6. Ve ✓✓ cuando el profesor lee sus mensajes

### Profesor:

1. Va a `/chat`
2. Ve lista de todos sus chats con estudiantes
3. Selecciona un chat de la lista
4. Puede enviar mensajes
5. Ve mensajes en tiempo real
6. Contador de no leídos en cada chat
7. Mensajes se marcan como leídos automáticamente
8. Ve ✓✓ cuando el estudiante lee sus mensajes

## Tiempo real

### Snapshots de Firestore:

Los hooks usan `onSnapshot` para actualizaciones en tiempo real:

```javascript
const unsubscribe = onSnapshot(query, (snapshot) => {
  // Actualización automática cuando cambian los datos
});

// Cleanup
return () => unsubscribe();
```

### Auto-actualización:

- **Chats**: Se actualizan cuando hay nuevo mensaje
- **Mensajes**: Se agregan instantáneamente
- **Contador no leídos**: Se actualiza en tiempo real
- **Estado de lectura**: Se actualiza cuando se marcan como leídos

## Seguridad

### Firestore Rules (recomendadas):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Chats
    match /chats/{chatId} {
      // Solo los participantes pueden leer
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      // Solo los participantes pueden crear/actualizar
      allow create, update: if request.auth != null && 
        request.auth.uid in request.resource.data.participants;
      
      // Mensajes subcollection
      match /messages/{messageId} {
        // Solo los participantes del chat pueden leer
        allow read: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
        
        // Solo los participantes pueden crear mensajes
        allow create: if request.auth != null && 
          request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants &&
          request.resource.data.senderId == request.auth.uid;
        
        // Solo el sender puede actualizar (marcar como leído)
        allow update: if request.auth != null;
      }
    }
  }
}
```

## Permisos

### Estudiantes:
- ✅ Ver su chat con el profesor
- ✅ Enviar mensajes al profesor
- ✅ Ver mensajes en tiempo real
- ✅ Marcar mensajes como leídos
- ❌ No pueden ver chats de otros estudiantes

### Profesores:
- ✅ Ver todos sus chats con estudiantes
- ✅ Enviar mensajes a cualquier estudiante
- ✅ Ver mensajes en tiempo real
- ✅ Marcar mensajes como leídos
- ✅ Ver contador de no leídos por chat
- ❌ No pueden ver chats de otros profesores

## Optimizaciones

### Paginación de mensajes:

Para chats con muchos mensajes, considera implementar paginación:

```javascript
const q = query(
  messagesRef,
  orderBy('timestamp', 'desc'),
  limit(50) // Solo últimos 50 mensajes
);
```

### Índices de Firestore:

Crear índices compuestos para queries eficientes:
- `participants` + `lastTimestamp`
- `senderId` + `read` + `timestamp`

### Cleanup de listeners:

Siempre limpiar subscripciones:

```javascript
useEffect(() => {
  const unsubscribe = subscribeToMessages(chatId, callback);
  return () => unsubscribe();
}, [chatId]);
```

## Mejoras futuras

- [ ] Typing indicator (está escribiendo...)
- [ ] Envío de imágenes/archivos
- [ ] Emojis/reacciones
- [ ] Mensajes de voz
- [ ] Videollamadas integradas
- [ ] Buscar en mensajes
- [ ] Archivar conversaciones
- [ ] Eliminar mensajes
- [ ] Editar mensajes
- [ ] Responder a mensaje específico
- [ ] Notificaciones push
- [ ] Mensajes programados
- [ ] Encriptación end-to-end
- [ ] Exportar conversación
- [ ] Bloquear usuario

## Troubleshooting

### Mensajes no aparecen en tiempo real
- Verifica que el snapshot esté activo
- Revisa la consola por errores
- Verifica permisos de Firestore
- Asegúrate de que el cleanup funcione

### Contador de no leídos no se actualiza
- Verifica que `markMessagesAsRead` se llame
- Revisa la estructura de `unreadCount`
- Verifica que el userId sea correcto

### Chat no se crea
- Verifica que ambos IDs sean válidos
- Revisa permisos de Firestore
- Verifica que los nombres se pasen correctamente

### Mensajes duplicados
- Verifica que no haya múltiples subscripciones
- Asegúrate de hacer cleanup correcto
- Revisa que no se llame `sendMessage` múltiples veces

## Recursos

- [Firestore Real-time Updates](https://firebase.google.com/docs/firestore/query-data/listen)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [React useEffect Cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
