/**
 * Products Feature
 * Exportación centralizada del feature de productos
 */

// Pages
export { default as ProductsListPage } from './pages/ProductsListPage';
export { default as ProductDetailPage } from './pages/ProductDetailPage';

// Components
export { default as ProductCard } from './components/ProductCard';
export { default as ProductSkeleton } from './components/ProductSkeleton';
export { default as EmptyProducts } from './components/EmptyProducts';

// Hooks
export * from './hooks/useProducts';

// Services
export * from './services/productService';
