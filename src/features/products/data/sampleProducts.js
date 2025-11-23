/**
 * Sample Products Data
 * Datos de ejemplo para productos
 * 
 * IMPORTANTE: Estos datos deben ser agregados manualmente a Firestore
 * o mediante un script de seed
 */

export const sampleProducts = [
  {
    title: 'Desarrollo Web Full Stack',
    description: 'Aprende a crear aplicaciones web completas desde cero. Domina HTML, CSS, JavaScript, React, Node.js y bases de datos. Ideal para principiantes que quieren convertirse en desarrolladores profesionales.',
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
    image: null,
  },
  {
    title: 'Diseño UI/UX con Figma',
    description: 'Domina el diseño de interfaces y experiencia de usuario. Aprende a usar Figma profesionalmente y crea diseños que enamoren a tus usuarios.',
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
    image: null,
  },
  {
    title: 'Marketing Digital y SEO',
    description: 'Aprende estrategias de marketing digital que funcionan. SEO, SEM, redes sociales, email marketing y analítica web.',
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
      'Conocimientos básicos de internet',
      'Ganas de aprender marketing'
    ],
    image: null,
  },
  {
    title: 'Inglés Conversacional',
    description: 'Mejora tu inglés hablado con clases prácticas y dinámicas. Enfoque en conversación real y pronunciación.',
    category: 'Idiomas',
    price: 35,
    duration: 45,
    level: 'Intermedio',
    featured: false,
    teacherName: 'John Smith',
    teacherBio: 'Native English speaker, 10 years teaching',
    studentsCount: 203,
    features: [
      'Conversación práctica',
      'Pronunciación nativa',
      'Vocabulario útil',
      'Expresiones idiomáticas',
      'Práctica de listening'
    ],
    requirements: [
      'Nivel básico de inglés',
      'Micrófono y cámara'
    ],
    image: null,
  },
  {
    title: 'Guitarra para Principiantes',
    description: 'Aprende a tocar guitarra desde cero. Acordes, ritmos, canciones populares y técnica básica.',
    category: 'Música',
    price: 30,
    duration: 60,
    level: 'Principiante',
    featured: false,
    teacherName: 'Pedro Sánchez',
    teacherBio: 'Guitarrista profesional con 15 años de experiencia',
    studentsCount: 78,
    features: [
      'Acordes básicos',
      'Ritmos fundamentales',
      'Canciones populares',
      'Técnica de mano derecha e izquierda',
      'Lectura de tablaturas'
    ],
    requirements: [
      'Guitarra acústica o eléctrica',
      'Afinador (app o físico)',
      'Ganas de practicar'
    ],
    image: null,
  },
  {
    title: 'Yoga y Meditación',
    description: 'Clases de yoga para todos los niveles. Mejora tu flexibilidad, fuerza y bienestar mental.',
    category: 'Deportes',
    price: 25,
    duration: 60,
    level: 'Todos los niveles',
    featured: false,
    teacherName: 'Laura Fernández',
    teacherBio: 'Instructora certificada de Yoga',
    studentsCount: 145,
    features: [
      'Posturas básicas y avanzadas',
      'Técnicas de respiración',
      'Meditación guiada',
      'Relajación profunda',
      'Yoga terapéutico'
    ],
    requirements: [
      'Mat de yoga',
      'Ropa cómoda',
      'Espacio tranquilo'
    ],
    image: null,
  },
];

/**
 * Script para agregar productos a Firestore
 * Ejecutar en la consola del navegador después de autenticarse
 */
export const seedProductsScript = `
// Copiar y pegar en la consola del navegador
import { collection, addDoc } from 'firebase/firestore';
import { db } from './services/firebase';
import { sampleProducts } from './features/products/data/sampleProducts';

const seedProducts = async () => {
  const productsRef = collection(db, 'products');
  
  for (const product of sampleProducts) {
    try {
      const docRef = await addDoc(productsRef, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log('Producto agregado:', docRef.id);
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  }
  
  console.log('Seed completado!');
};

seedProducts();
`;
