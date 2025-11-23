# Agregar Productos de Ejemplo

Para agregar productos de ejemplo a Firestore, sigue estos pasos:

## Opción 1: Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Crea una colección llamada `products`
5. Agrega documentos manualmente usando los datos de `src/features/products/data/sampleProducts.js`

## Opción 2: Script en la aplicación

1. Inicia sesión en la aplicación
2. Abre la consola del navegador (F12)
3. Copia y pega el siguiente código:

```javascript
// Importar dependencias
import { collection, addDoc } from 'firebase/firestore';
import { db } from './src/services/firebase/config';

// Datos de ejemplo
const sampleProducts = [
  {
    title: 'Desarrollo Web Full Stack',
    description: 'Aprende a crear aplicaciones web completas desde cero. Domina HTML, CSS, JavaScript, React, Node.js y bases de datos.',
    category: 'Programación',
    price: 50,
    duration: 60,
    level: 'Principiante',
    featured: true,
    teacherName: 'Carlos Rodríguez',
    teacherBio: 'Full Stack Developer con 8 años de experiencia',
    studentsCount: 124,
    features: [
      'HTML5 y CSS3 moderno',
      'JavaScript ES6+',
      'React y hooks',
      'Node.js y Express',
      'MongoDB y bases de datos',
      'Despliegue en producción'
    ],
    requirements: [
      'Computadora con acceso a internet',
      'Ganas de aprender',
      'No se requiere experiencia previa'
    ],
  },
  {
    title: 'Diseño UI/UX con Figma',
    description: 'Domina el diseño de interfaces y experiencia de usuario. Aprende a usar Figma profesionalmente.',
    category: 'Diseño',
    price: 45,
    duration: 90,
    level: 'Intermedio',
    featured: true,
    teacherName: 'María González',
    teacherBio: 'UI/UX Designer en empresas tech',
    studentsCount: 89,
    features: [
      'Fundamentos de diseño',
      'Figma avanzado',
      'Prototipado interactivo',
      'Design systems',
      'Usabilidad y accesibilidad'
    ],
    requirements: [
      'Cuenta gratuita de Figma',
      'Conocimientos básicos de diseño'
    ],
  },
  {
    title: 'Marketing Digital y SEO',
    description: 'Aprende estrategias de marketing digital que funcionan. SEO, SEM, redes sociales.',
    category: 'Marketing',
    price: 40,
    duration: 60,
    level: 'Principiante',
    featured: false,
    teacherName: 'Ana Martínez',
    teacherBio: 'Marketing Manager con 6 años de experiencia',
    studentsCount: 156,
    features: [
      'SEO on-page y off-page',
      'Google Ads y Facebook Ads',
      'Content marketing',
      'Email marketing',
      'Google Analytics'
    ],
    requirements: [
      'Conocimientos básicos de internet'
    ],
  },
];

// Función para agregar productos
const seedProducts = async () => {
  const productsRef = collection(db, 'products');
  
  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(productsRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Producto agregado:', product.title, '- ID:', docRef.id);
    } catch (error) {
      console.error('❌ Error agregando producto:', product.title, error);
    }
  }
  
  console.log('🎉 Seed completado!');
};

// Ejecutar
seedProducts();
```

## Opción 3: Crear manualmente

Crea documentos en Firestore con esta estructura:

```json
{
  "title": "Nombre del curso",
  "description": "Descripción detallada...",
  "category": "Programación",
  "price": 50,
  "duration": 60,
  "level": "Principiante",
  "featured": true,
  "teacherName": "Nombre del profesor",
  "teacherBio": "Biografía...",
  "studentsCount": 100,
  "features": ["Feature 1", "Feature 2"],
  "requirements": ["Requisito 1"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Verificar

Después de agregar productos:

1. Ve a `/products` en la aplicación
2. Deberías ver las cards de productos
3. Haz clic en "Ver más" para ver el detalle
4. Prueba los filtros y la búsqueda

## Categorías disponibles

- Programación
- Diseño
- Marketing
- Idiomas
- Música
- Deportes
