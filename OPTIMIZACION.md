# ⚡ Guía de Optimización - Lobito Corner

## 🎯 Optimizaciones Implementadas

### 1. **Code Splitting y Lazy Loading**

#### Lazy Loading de Rutas:

```javascript
// Implementar en router/index.jsx
import { lazy, Suspense } from 'react';

const BlogListPage = lazy(() => import('@features/blog/pages/BlogListPage'));
const BlogPostPage = lazy(() => import('@features/blog/pages/BlogPostPage'));
const TeacherDashboardPage = lazy(() => import('@/router/pages/TeacherDashboardPage'));

// Wrap con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <BlogListPage />
</Suspense>
```

#### Lazy Loading de Componentes Pesados:

```javascript
// Para componentes grandes como editores
const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));
```

### 2. **Optimización de Imágenes**

#### Usar formatos modernos:

```javascript
// Convertir imágenes a WebP
// Usar herramientas como:
// - Squoosh (https://squoosh.app)
// - ImageOptim
// - TinyPNG
```

#### Lazy loading de imágenes:

```jsx
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Description"
/>
```

### 3. **Memoización**

#### React.memo para componentes:

```javascript
import { memo } from 'react';

const ProductCard = memo(({ product }) => {
  // Component code
});

export default ProductCard;
```

#### useMemo para cálculos costosos:

```javascript
import { useMemo } from 'react';

const filteredProducts = useMemo(() => {
  return products.filter(p => p.category === selectedCategory);
}, [products, selectedCategory]);
```

#### useCallback para funciones:

```javascript
import { useCallback } from 'react';

const handleClick = useCallback(() => {
  // Handler code
}, [dependencies]);
```

### 4. **Optimización de Bundle**

#### Analizar el bundle:

```bash
# Instalar
npm install --save-dev rollup-plugin-visualizer

# Agregar a vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});

# Build y ver análisis
npm run build
```

#### Tree Shaking:

```javascript
// ✅ Bueno - Import específico
import { Button } from '@design';

// ❌ Malo - Import completo
import * as Design from '@design';
```

### 5. **Optimización de Firestore**

#### Índices compuestos:

```javascript
// Crear índices en Firebase Console para queries comunes
// Ejemplo: posts ordenados por fecha y categoría
// Index: collection=posts, fields=(category,ASC), (publishedAt,DESC)
```

#### Paginación:

```javascript
import { query, limit, startAfter } from 'firebase/firestore';

const q = query(
  collection(db, 'posts'),
  orderBy('publishedAt', 'desc'),
  limit(10)
);

// Para siguiente página
const nextQ = query(
  collection(db, 'posts'),
  orderBy('publishedAt', 'desc'),
  startAfter(lastDoc),
  limit(10)
);
```

#### Caché local:

```javascript
import { enableIndexedDbPersistence } from 'firebase/firestore';

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open
    } else if (err.code == 'unimplemented') {
      // Browser doesn't support
    }
  });
```

### 6. **Optimización de Storage**

#### Compresión de archivos:

```javascript
// Antes de subir, comprimir imágenes/videos
import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true
};

const compressedFile = await imageCompression(file, options);
```

#### Metadata caché:

```javascript
// Usar metadata para evitar descargas innecesarias
const metadata = await getMetadata(fileRef);
if (metadata.size > MAX_SIZE) {
  // Don't download
}
```

### 7. **Optimización de Renderizado**

#### Virtual Scrolling para listas largas:

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={100}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ProductCard product={items[index]} />
    </div>
  )}
</FixedSizeList>
```

#### Debounce para búsquedas:

```javascript
import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Uso
const debouncedSearch = useDebounce(searchTerm, 500);
```

### 8. **Service Worker y PWA**

#### Configurar Vite PWA:

```bash
npm install vite-plugin-pwa -D
```

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Lobito Corner',
        short_name: 'Lobito',
        description: 'Plataforma de enseñanza',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

### 9. **Optimización de CSS**

#### PurgeCSS (ya incluido en Tailwind):

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Tailwind automáticamente purga CSS no usado
}
```

#### Critical CSS:

```javascript
// Inline critical CSS en index.html
<style>
  /* Critical CSS aquí */
  body { margin: 0; font-family: system-ui; }
</style>
```

### 10. **Optimización de Fuentes**

#### Preload de fuentes:

```html
<!-- index.html -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
```

#### Font display swap:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap;
}
```

## 📊 Métricas de Performance

### Core Web Vitals

Objetivos:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Herramientas de Medición

1. **Lighthouse** (Chrome DevTools)
2. **WebPageTest** (https://webpagetest.org)
3. **PageSpeed Insights** (https://pagespeed.web.dev)
4. **Vercel Analytics** (integrado)

## 🔍 Auditoría de Performance

### Checklist:

- [ ] Bundle size < 500KB (gzipped)
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 90
- [ ] Todas las imágenes optimizadas
- [ ] Lazy loading implementado
- [ ] Code splitting configurado
- [ ] Service Worker activo
- [ ] Caché configurado
- [ ] Compresión gzip/brotli habilitada

## 🚀 Optimizaciones Avanzadas

### 1. Prefetching de rutas:

```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Prefetch rutas probables
useEffect(() => {
  if (location.pathname === '/') {
    import('@features/products/pages/ProductsListPage');
  }
}, [location]);
```

### 2. Resource Hints:

```html
<!-- index.html -->
<link rel="dns-prefetch" href="https://firebasestorage.googleapis.com">
<link rel="preconnect" href="https://firestore.googleapis.com">
```

### 3. Compression:

Vercel automáticamente comprime con Brotli, pero verifica:

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 📝 Scripts de Optimización

### package.json:

```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build && vite-bundle-visualizer",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css,md}\"",
    "optimize:images": "imagemin src/assets/images/* --out-dir=src/assets/images/optimized"
  }
}
```

## 🎯 Resultados Esperados

Después de aplicar todas las optimizaciones:

- ⚡ **Bundle size**: ~300KB (gzipped)
- 🚀 **First Load**: < 2s
- 📊 **Lighthouse**: 95+
- 💚 **Core Web Vitals**: All Green
- 🔋 **Mobile Performance**: 90+

## 📚 Recursos

- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)
