# Products Feature

Sistema completo de gestión de productos/clases con Firestore.

## Estructura

```
products/
  ├── components/
  │   ├── ProductCard.jsx          # Card de producto
  │   ├── ProductSkeleton.jsx      # Loading skeleton
  │   └── EmptyProducts.jsx        # Estado vacío
  ├── hooks/
  │   └── useProducts.js           # Hooks personalizados
  ├── pages/
  │   ├── ProductsListPage.jsx     # Listado con filtros
  │   └── ProductDetailPage.jsx    # Detalle del producto
  ├── services/
  │   └── productService.js        # Servicios de Firestore
  ├── data/
  │   └── sampleProducts.js        # Datos de ejemplo
  └── index.js                     # Exportación centralizada
```

## Uso

### Importar componentes

```jsx
import { 
  ProductsListPage, 
  ProductDetailPage,
  ProductCard 
} from '@features/products';
```

### Hooks

```jsx
import { useProducts, useProduct } from '@features/products';

// Obtener todos los productos
const { products, loading, error, refetch } = useProducts();

// Obtener un producto específico
const { product, loading, error } = useProduct(productId);
```

### Servicios

```jsx
import { 
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct 
} from '@features/products';

// Obtener productos
const { products, error } = await getAllProducts();

// Crear producto
const { productId, error } = await createProduct(productData);
```

## Firestore Schema

### Collection: `products`

```javascript
{
  id: "auto_generated_id",
  title: "Nombre del producto",
  description: "Descripción detallada...",
  category: "Programación", // Programación, Diseño, Marketing, Idiomas, Música, Deportes
  price: 50, // Precio en USD
  duration: 60, // Duración en minutos
  level: "Principiante", // Principiante, Intermedio, Avanzado, Todos los niveles
  featured: true, // Producto destacado
  teacherId: "firebase_uid", // ID del profesor
  teacherName: "Nombre del profesor",
  teacherBio: "Biografía corta...",
  studentsCount: 124, // Número de estudiantes
  features: [
    "Feature 1",
    "Feature 2"
  ],
  requirements: [
    "Requisito 1",
    "Requisito 2"
  ],
  image: "url_de_imagen", // Opcional
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## Características

✅ **Listado de productos** con grid responsive  
✅ **Filtros** por categoría y búsqueda  
✅ **Detalle completo** del producto  
✅ **Loading states** con skeletons  
✅ **Empty states** personalizados  
✅ **Botón "Agendar Clase"** que redirige al calendario  
✅ **Cards atractivas** con badges y precios  
✅ **Productos destacados** con badge especial  
✅ **Información del profesor**  
✅ **Sistema de categorías** con iconos  
✅ **Responsive design**  

## Categorías disponibles

- 📚 **Todos** - Muestra todos los productos
- 💻 **Programación** - Cursos de desarrollo
- 🎨 **Diseño** - UI/UX, diseño gráfico
- 📈 **Marketing** - Marketing digital, SEO
- 🌍 **Idiomas** - Clases de idiomas
- 🎵 **Música** - Instrumentos, teoría musical
- ⚽ **Deportes** - Fitness, yoga, deportes

## Rutas

- `/products` - Listado de productos
- `/products/:id` - Detalle del producto

## Agregar productos de ejemplo

1. Ir a Firebase Console
2. Crear colección `products`
3. Usar los datos de `data/sampleProducts.js`
4. O ejecutar el script de seed (ver archivo)

## Próximas mejoras

- [ ] Sistema de reviews y ratings
- [ ] Filtros avanzados (precio, duración, nivel)
- [ ] Ordenamiento (más popular, más nuevo, precio)
- [ ] Wishlist / Favoritos
- [ ] Compartir productos
- [ ] Productos relacionados
- [ ] Sistema de descuentos
- [ ] Paquetes de clases
