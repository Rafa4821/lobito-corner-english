# Blog Feature

Sistema completo de blog con gestión de posts para profesores.

## Estructura

```
blog/
  ├── components/
  │   ├── PostCard.jsx          # Card de post para listado
  │   ├── PostEditor.jsx        # Editor de posts
  │   └── PostSkeleton.jsx      # Loading skeleton
  ├── hooks/
  │   └── useBlog.js            # Hooks personalizados
  ├── pages/
  │   ├── BlogListPage.jsx      # Listado de posts
  │   ├── BlogPostPage.jsx      # Detalle del post
  │   └── BlogEditorPage.jsx    # Crear/editar post (teachers)
  ├── services/
  │   └── blogService.js        # Servicios de Firestore
  └── index.js                  # Exportación centralizada
```

## Características

✅ **Listado de posts** con filtros y búsqueda  
✅ **Detalle completo** del post  
✅ **Crear posts** (solo profesores)  
✅ **Editar posts** (solo el autor)  
✅ **Eliminar posts** (solo el autor)  
✅ **Categorías** con colores  
✅ **Posts destacados**  
✅ **Borradores** (no publicados)  
✅ **Contador de vistas**  
✅ **Tiempo de lectura** automático  
✅ **Editor simple** con validación  
✅ **Protección por rol** (teacher)  

## Rutas

- `/blog` - Listado de posts (todos)
- `/blog/:id` - Detalle del post (todos)
- `/blog/new` - Crear post (solo teachers)
- `/blog/edit/:id` - Editar post (solo autor)

## Firestore Schema

### Collection: `blogPosts`

```javascript
{
  id: "auto_generated",
  title: "Título del post",
  excerpt: "Resumen breve...",
  content: "Contenido completo del post...",
  category: "Tecnología", // Tecnología, Educación, Programación, Diseño, Marketing, Idiomas, Otros
  coverImage: "https://...", // Opcional
  featured: false,
  published: true,
  authorId: "firebase_uid",
  authorName: "Nombre del profesor",
  views: 0,
  likes: 0,
  readTime: 5, // minutos
  publishedAt: "2024-01-01T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## Uso

### Hooks

```jsx
import { usePosts, usePost } from '@features/blog';

// Obtener todos los posts
const { posts, loading, error, refetch } = usePosts();

// Obtener un post específico
const { post, loading, error } = usePost(postId);
```

### Servicios

```jsx
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '@features/blog';

// Crear post
const { postId, error } = await createPost({
  title: "Mi primer post",
  content: "Contenido...",
  category: "Tecnología",
  published: true,
  authorId: user.uid,
  authorName: user.displayName,
});

// Actualizar post
await updatePost(postId, {
  title: "Título actualizado",
  content: "Nuevo contenido...",
});

// Eliminar post
await deletePost(postId);
```

## Permisos

### Todos los usuarios autenticados:
- ✅ Ver listado de posts publicados
- ✅ Ver detalle de posts publicados
- ✅ Buscar y filtrar posts

### Solo profesores (role: "teacher"):
- ✅ Crear nuevos posts
- ✅ Ver sus propios borradores
- ✅ Editar sus propios posts
- ✅ Eliminar sus propios posts
- ✅ Marcar posts como destacados
- ✅ Publicar/despublicar posts

### Validaciones:
- El editor verifica que el usuario sea profesor
- Solo el autor puede editar/eliminar su post
- Los borradores solo son visibles para el autor

## Editor de posts

### Campos:

1. **Título** (requerido)
   - Mínimo 10 caracteres
   - Máximo recomendado: 100 caracteres

2. **Resumen** (opcional)
   - Breve descripción del post
   - Si no se completa, se usa el inicio del contenido

3. **Contenido** (requerido)
   - Mínimo 50 caracteres
   - Texto plano con saltos de línea
   - Contador de palabras en tiempo real

4. **Categoría** (requerido)
   - Selector visual con botones
   - 7 categorías predefinidas

5. **Imagen de portada** (opcional)
   - URL de imagen externa
   - Se muestra en card y detalle

6. **Post destacado** (checkbox)
   - Aparece con badge especial
   - Puede usarse para featured section

7. **Publicar** (checkbox)
   - Publicado: visible para todos
   - Borrador: solo visible para el autor

### Funciones automáticas:

- **Tiempo de lectura**: Se calcula automáticamente (200 palabras/min)
- **Fechas**: `createdAt`, `updatedAt`, `publishedAt` se gestionan automáticamente
- **Vistas**: Se incrementan al ver el post
- **Autor**: Se asigna automáticamente del usuario actual

## Categorías

- 💻 **Tecnología** - Color primary
- 🎓 **Educación** - Color secondary
- ⚡ **Programación** - Color accent
- 🎨 **Diseño** - Color info
- 📈 **Marketing** - Color warning
- 🌍 **Idiomas** - Color success
- 📚 **Otros** - Color default

## Componentes

### PostCard

Card para mostrar en el listado:
- Imagen de portada o placeholder
- Badge de categoría
- Badge de destacado
- Título (máx 2 líneas)
- Excerpt (máx 3 líneas)
- Avatar y nombre del autor
- Fecha de publicación
- Vistas y tiempo de lectura

### PostEditor

Editor completo con:
- Validación de campos
- Contador de palabras
- Selector de categoría visual
- Checkboxes para opciones
- Botones de guardar/cancelar
- Estados de loading

### PostSkeleton

Loading skeleton animado con la misma estructura que PostCard.

## Flujo de creación

1. Usuario profesor hace clic en "Nuevo Post"
2. Completa el formulario
3. Puede guardar como borrador o publicar
4. Al guardar, se calcula el tiempo de lectura
5. Se redirige al detalle del post
6. Puede editar o eliminar desde el detalle

## Flujo de edición

1. Autor hace clic en "Editar Post" en el detalle
2. Se carga el formulario con los datos actuales
3. Puede modificar cualquier campo
4. Al guardar, se actualiza `updatedAt`
5. Si cambia de borrador a publicado, se actualiza `publishedAt`
6. Se redirige al detalle actualizado

## Búsqueda y filtros

### Búsqueda:
- Busca en título, excerpt y contenido
- Case insensitive
- En tiempo real

### Filtros:
- Por categoría (7 opciones + "Todos")
- Visual con botones
- Se puede combinar con búsqueda

### Stats:
- Muestra número de resultados
- Badges de filtros activos
- Se actualiza en tiempo real

## Mejoras futuras

- [ ] Soporte para Markdown
- [ ] Editor WYSIWYG
- [ ] Subida de imágenes a Firebase Storage
- [ ] Sistema de comentarios
- [ ] Sistema de likes
- [ ] Tags/etiquetas
- [ ] Posts relacionados
- [ ] Compartir en redes sociales
- [ ] SEO metadata
- [ ] Paginación
- [ ] Ordenamiento (más visto, más reciente, etc.)
- [ ] Versiones/historial de cambios

## Testing

### Crear post de prueba:

```javascript
const testPost = {
  title: "Mi primer post de prueba",
  excerpt: "Este es un post de prueba para el blog",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(20),
  category: "Tecnología",
  coverImage: "https://picsum.photos/800/400",
  featured: true,
  published: true,
  authorId: user.uid,
  authorName: user.displayName,
};

await createPost(testPost);
```

## Troubleshooting

### Posts no aparecen en el listado
- Verifica que `published: true`
- Verifica que `publishedAt` tenga valor
- Revisa reglas de Firestore

### No puedo crear posts
- Verifica que tu rol sea "teacher"
- Revisa la consola por errores
- Verifica permisos de Firestore

### No puedo editar un post
- Solo el autor puede editar
- Verifica que `authorId` coincida con tu `uid`
- Verifica que seas profesor

### Error al eliminar
- Solo el autor puede eliminar
- Verifica permisos de Firestore
- Confirma la eliminación en el modal

## Recursos

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [React Router](https://reactrouter.com)
- [Markdown Guide](https://www.markdownguide.org) (para futuras mejoras)
